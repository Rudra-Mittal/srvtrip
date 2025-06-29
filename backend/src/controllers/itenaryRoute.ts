import express, { Response } from "express";
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

export const itenaryRoute = async (req: AuthRequest, res: Response) => {
  // Check if client wants SSE by looking at Accept header
  const wantsSSE = req.headers.accept?.includes('text/event-stream');
  
  // Set up SSE if requested
  if (wantsSSE) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
    });
    
    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to itinerary generation stream' })}\n\n`);
  }

  const sendProgress = (step: number, totalSteps: number, message: string) => {
    if (wantsSSE) {
      res.write(`data: ${JSON.stringify({ 
        type: 'progress', 
        message, 
        step, 
        totalSteps 
      })}\n\n`);
    }
  };

  const sendError = (message: string) => {
    if (wantsSSE) {
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        message 
      })}\n\n`);
      res.end();
    } else {
      if (message === 'Invalid destination') {
        res.status(403).json({ "error": message });
      } else {
        res.status(500).json({ "error": message });
      }
    }
  };

  const sendSuccess = (data: any) => {
    if (wantsSSE) {
      res.write(`data: ${JSON.stringify({ 
        type: 'success', 
        data,
        message: 'Itinerary generated successfully!' 
      })}\n\n`);
      res.end();
    } else {
      res.json(data);
    }
  };

  try {
    const { prompt } = req.body;
    console.log("prompt", prompt);

    const userId = req.user?.userId;
    console.log(userId);

    if (!userId) {
      sendError("User not found");
      return;
    }

    // Progress Step 1
    sendProgress(1, 8, 'Scanning the globe for your dream destination...');

    // Check if destination is valid
    const placeFound = await placeInfo(prompt.destination, 1, 0);
    if (placeFound.notfound) {
      console.log("No place found for this name");
      sendError("Invalid destination");
      return;
    }

    // Progress Step 2
    sendProgress(2, 8, 'Crafting a personalized adventure with AI magic...');

    const itenary = await generate2(prompt);

    // Progress Step 3
    sendProgress(3, 8, 'Uncovering hidden gems and must-see spots...');

    const allDayPlaces = extractPlacesByRegex(itenary);

    // Progress Step 4
    sendProgress(4, 8, 'Gathering stunning photos and essential info...');

    const placesData = await Promise.all(
      allDayPlaces.map((dayPlaces, index) =>
        Promise.all(dayPlaces.map((place) => placeInfo(place, index + 1)))
      )
    ) as placesData;

    // Progress Step 5
    sendProgress(5, 8, 'Piecing together your perfect travel experience...');

    let dayNum = 0;
    let newItenary = replacePlace(itenary, placesData);

    // Progress Step 6
    sendProgress(6, 8, 'Saving your itinerary masterpiece...');

    const itenaryid = await createItenary(newItenary, userId);
    if (!itenaryid) {
      sendError("Failed to save itinerary");
      return;
    }

    // Add the itinerary ID to the new itinerary
    const newItenaryObject = JSON.parse(newItenary);
    newItenaryObject.itinerary.id = itenaryid;
    newItenary = JSON.stringify(newItenaryObject);

    // Progress Step 7
    for (const day of placesData) {
      const dayId = await createDay(dayNum, itenaryid, newItenary);
      for (const place of day) {
        sendProgress(
          7,
          8,
          `"${place.displayName}" — fetching reviews & turbocharging your trip...`
        );
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

    // Progress Step 8
    sendProgress(8, 8, 'All set! Your unforgettable journey is ready to explore!');

    console.log("Places Data in backend iti route:", placesData);
    
    sendSuccess({
      success:"true"
    });

  } catch (err) {
    console.log(err);
    sendError("Internal server error");
  }
};