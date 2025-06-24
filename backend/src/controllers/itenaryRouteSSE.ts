import { Request, Response } from 'express';
import { AuthRequest, placesData } from "../utils/types";
import { generate2 } from "../AIController2";
import { extractPlacesByRegex } from "../AIController2/services/extractPlacesbyRegex";
import { getPhotoUri, placeInfo } from "./places";
import { replacePlace } from "../utils/replaceName";
import createItenary from "../utils/createItenary";
import createDay from "../utils/createDay";
import checkPlaceAndReturnPhotos from "./checkPlaceInDb";
import connectPlace from "../utils/connectPlace";
import createPlace from "../utils/createPlace";
import callWebScrapper from "./callWebScrapper";

export const itenaryRouteSSE = async (req: AuthRequest, res: Response) => {
    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true',
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to itinerary generation stream' })}\n\n`);

    try {
        const { prompt } = req.body;
        console.log("prompt", prompt);

        const userId = req.user?.userId;
        console.log(userId);

        if (!userId) {
            res.write(`data: ${JSON.stringify({ 
                type: 'error', 
                message: 'User not found' 
            })}\n\n`);
            res.end();
            return;
        }

        // Send progress updates
        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Validating destination...', 
            step: 1, 
            totalSteps: 8 
        })}\n\n`);

        // Check if destination is valid
        const placeFound = await placeInfo(prompt.destination, 1, 0);
        if (placeFound.notfound) {
            console.log("No place found for this name");
            res.write(`data: ${JSON.stringify({ 
                type: 'error', 
                message: 'Invalid destination' 
            })}\n\n`);
            res.end();
            return;
        }

        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Generating AI itinerary...', 
            step: 2, 
            totalSteps: 8 
        })}\n\n`);

        const itenary = await generate2(prompt);

        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Extracting places from itinerary...', 
            step: 3, 
            totalSteps: 8 
        })}\n\n`);

        const allDayPlaces = extractPlacesByRegex(itenary);

        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Fetching place information and photos...', 
            step: 4, 
            totalSteps: 8 
        })}\n\n`);

        const placesData = await Promise.all(
            allDayPlaces.map((dayPlaces, index) =>
                Promise.all(dayPlaces.map((place) => placeInfo(place, index + 1)))
            )
        ) as placesData;

        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Processing place data...', 
            step: 5, 
            totalSteps: 8 
        })}\n\n`);

        let dayNum = 0;
        let newItenary = replacePlace(itenary, placesData);

        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Saving itinerary to database...', 
            step: 6, 
            totalSteps: 8 
        })}\n\n`);

        const itenaryid = await createItenary(newItenary, userId);
        if (!itenaryid) {
            res.write(`data: ${JSON.stringify({ 
                type: 'error', 
                message: 'Failed to save itinerary' 
            })}\n\n`);
            res.end();
            return;
        }

        // Add the itinerary ID to the new itinerary
        const newItenaryObject = JSON.parse(newItenary);
        newItenaryObject.itinerary.id = itenaryid;
        newItenary = JSON.stringify(newItenaryObject);

        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Processing places and photos...', 
            step: 7, 
            totalSteps: 8 
        })}\n\n`);

        // Process places and create database entries
        for (const day of placesData) {
            const dayId = await createDay(dayNum, itenaryid, newItenary);
            for (const place of day) {
                console.log("Place:", place);
                const placeD = await checkPlaceAndReturnPhotos(place);
                if (placeD.id) {
                    console.log("Place already exist in db");
                    const id = await connectPlace(placeD.id, dayId);
                    if (id) {
                        place.photos = placeD.images.map((image) => image.imageUrl);
                    } else {
                        console.log("Error connecting place");
                    }
                } else {
                    // Call the photos api
                    const placePhotos = await Promise.all((place.photos?.map((reference: string) => getPhotoUri(reference))));
                    place.photos = placePhotos;
                    const placeD = await createPlace(place, dayId, placePhotos);
                    if (!placeD) {
                        console.log("Error creating place");
                    } else {
                        callWebScrapper(place.displayName, 5, place.id, place.formattedAddress);
                    }
                }
                place.summarizedReview = null;
            }
            dayNum++;
        }

        res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: 'Finalizing itinerary...', 
            step: 8, 
            totalSteps: 8 
        })}\n\n`);

        console.log("Places Data in backend iti route:", placesData);
        
        // Send successful result
        res.write(`data: ${JSON.stringify({ 
            type: 'success', 
            data: { 
                newItenary: newItenary, 
                placesData: JSON.stringify(placesData)
            },
            message: 'Itinerary generated successfully!',
            itineraryId: itenaryid
        })}\n\n`);

    } catch (error: any) {
        console.error('Error in itinerary generation:', error);
        res.write(`data: ${JSON.stringify({ 
            type: 'error', 
            message: error.message || 'Failed to generate itinerary',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })}\n\n`);
    } finally {
        res.end();
    }
};
