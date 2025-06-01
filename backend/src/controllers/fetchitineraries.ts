import { PrismaClient } from "@prisma/client";
import { AuthRequest, place, placesData } from "../utils/types";
import { Response } from "express";

export async function fetchItineraries(req: AuthRequest, res: Response) {
    const prisma = new PrismaClient();
    const user = req.user;
    
    // Extract storedIds from request body
    const { ids: storedIds } = req.body;
    
    console.log("Received stored IDs:", storedIds);
    
    if (!user?.userId) {
        res.status(401).json({ "error": "Unauthorized: No token provided" });
        return;
    }
    
    // Validate storedIds
    if (storedIds && !Array.isArray(storedIds)) {
        res.status(400).json({ "error": "Invalid format: storedIds must be an array" });
        return;
    }
    
    // Update Prisma query to exclude itineraries with IDs in storedIds
    const itinerariesD = await prisma.itinerary.findMany({
        where: {
            userId: user.userId,
            ...(storedIds && storedIds.length > 0 ? {
                id: {
                    notIn: storedIds
                }
            } : {})
        },
        include: {
            days: {
                include: {
                    places: {
                        include: {
                            images: true
                        }
                    }
                }
            }
        }
    });
    
    console.log(`Found ${itinerariesD.length} new itineraries`);
    
    let placesData: any[] = []; // for all itineraries with one itinerary and then inside it all days places in that one itinerary
    let itineraries: any[] = []; // for all itineraries with one itinerary and then inside it all days places in that one itinerary
    
    for (let i = 0; i < itinerariesD.length; i++) {
        // Rest of your existing code remains the same
        let itinerary = itinerariesD[i];
        let days = itinerary.days;
        let modifiedDays = [];
        placesData.push([]);
        
        for (let j = 0; j < days.length; j++) {
            const day = days[j];
            modifiedDays.push({
                day: day.dayNumber,
                morning: day.morning,
                afternoon: day.afternoon,
                evening: day.evening,
                tips: day.proTip,
            });
            
            const places = day.places;           
             placesData[i].push(
                places.map((place: any) => {
                    return {
                        placename: place.placeName,
                        id: place.placeId,
                        formattedAddress: place.address,
                        displayName: place.name,
                        summarizedReview: place.summarizedReview,
                        rating: place.rating,
                        location: {
                            latitude: place.latitude,
                            longitude: place.longitude
                        },
                        photos: place.images.map((image: any) => {
                            return image.imageUrl;
                        }),
                    };
                })
            );
        }
        
        modifiedDays.forEach(day => {
            if (typeof day.morning === 'string') {
                try {
                    day.morning = JSON.parse(day.morning);
                } catch (err) {
                    console.error("Error parsing morning JSON:", err);
                }
            }
            if (typeof day.afternoon === 'string') {
                try {
                    day.afternoon = JSON.parse(day.afternoon);
                } catch (err) {
                    console.error("Error parsing afternoon JSON:", err);
                }
            }
            if (typeof day.evening === 'string') {
                try {
                    day.evening = JSON.parse(day.evening);
                } catch (err) {
                    console.error("Error parsing evening JSON:", err);
                }
            }
        });
        
        itineraries.push({
            itinerary: {
                id: itinerary.id,
                budget: itinerary.budget,
                destination: itinerary.destination,
                number_of_days: itinerary.duration,
                number_of_persons: itinerary.numberOfPersons,
                days: modifiedDays,
                start_date: itinerary.startdate,
                interests: itinerary.interests,
                total_budget_used: itinerary.totalBudgetUsed,
                remaining_budget: itinerary.remainingBudget,
            }
        });
    }
    
    res.status(200).json({ itineraries: itineraries, placesData: placesData });
    return;
}