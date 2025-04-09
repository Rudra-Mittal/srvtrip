import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../utils/types";
import { Response } from "express";

export async function itenarariesRoute(req:AuthRequest,res:Response){
    const prisma = new PrismaClient();
    const user=req.user
    if(!user?.userId){
        res.status(401).json({"error":"Unauthorized:No token provided"})
        return
    }
    const itineraries= await prisma.itinerary.findMany({
        where: {
           userId: user.userId
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
    })
    let placesData:any[]=[];//for all itineraries with one itinerary and then inside it all days places in tht one itinerary
    
    for(let i=0;i<itineraries.length;i++){
        //i want a separate array of places daywise for all itineraries in nested array for all itineraries then for one itinerary and then for one day
        //placesData for all itineraries
        
        let itinerary=itineraries[i];
        let days=itinerary.days;
        for(let j=0;j<days.length;j++){
            const day=days[j];
            const places=day.places;
            for(let k=0;k<places.length;k++){
                const place=places[k];
                placesData[i][j][k]={
                    dbId:place.id,
                    displayName:place.name,
                    formattedAddress:place.address,
                    id:place.placeId,
                    location:{latitude:place.latitude,longitude:place.longitude},
                    photos:place.images.map((image)=>image.imageUrl),
                    placeName:place.name
                }
            }
        }
    }

    //now take out the itineraries separately in the gemini like structure 
    let structuredItineraries=[];

    let days=[];//for each itinerary

    for(let i=0;i<itineraries.length;i++){
        const days=itineraries[i].days.map((day)=>({
            day:day.dayNumber,
            morning:day.morning,
            afternoon:day.afternoon,
            evening:day.evening,
            // budget:day.budget,
            tips:day.proTip
        }))

        const structuredItineray={
            destination:itineraries[i].destination,
            number_of_days:itineraries[i].duration,
            // start_date:itineraries[i]. 
            budget:itineraries[i].budget,
            // currency:itineraries[i].,
            number_of_persons:itineraries[i].numberOfPersons,
            interests:itineraries[i].interests,

            days:days,
            // total_budget_used:itineraries[i].totalBudgetUsed,
            // remaining_budget:itineraries[i].remainingBudget,
        }
        structuredItineraries.push(structuredItineray)
    }

    res.status(200).json({allItineraries:structuredItineraries,placesData:placesData})
}