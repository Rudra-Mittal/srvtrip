import { PrismaClient } from "@prisma/client";
import { AuthRequest, place, placesData } from "../utils/types";
import { Response } from "express";

export async function itenarariesRoute(req:AuthRequest,res:Response){
    const prisma = new PrismaClient();
    const user=req.user
    if(!user?.userId){
        res.status(401).json({"error":"Unauthorized:No token provided"})
        return
    }
    const itinerariesD= await prisma.itinerary.findMany({
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
    let itineraries:any[]=[];//for all itineraries with one itinerary and then inside it all days places in tht one itinerary
    for(let i=0;i<itinerariesD.length;i++){
        //i want a separate array of places daywise for all itineraries in nested array for all itineraries then for one itinerary and then for one day
        //placesData for all itineraries
        
        let itinerary=itinerariesD[i];
        let days=itinerary.days;
        let modifiedDays=[]
        placesData.push([]);
        for(let j=0;j<days.length;j++){
            const day=days[j];
            modifiedDays.push({
                day:day.dayNumber,
                morning:day.morning,
                afternoon:day.afternoon,
                evening:day.evening,
                tips:day.proTip,                
            })
            const places=day.places;
            placesData[i].push(
                places.map((place:any)=>{
                    return{
                        placename:place.placeName,
                        id:place.placeId,
                        formattedAddress:place.address,
                        displayName:place.name,
                        location:{
                            lat:place.latitude,
                            lng:place.longitude
                        },
                        photos:place.images.map((image:any)=>{
                            return image.imageUrl
                        }),
                    }
                })
            )
        }
        itineraries.push({
            itinerary:{
                budget:itinerary.budget,
                destination:itinerary.destination,
                number_of_days:itinerary.duration,
                number_of_persons:itinerary.numberOfPersons,
                days:modifiedDays,
                start_date:itinerary.startdate,
                interests:itinerary.interests,
                total_budget_used:itinerary.totalBudgetUsed,
                remaining_budget:itinerary.remainingBudget,
            }
        })
    }
    console.log(itineraries,placesData)
    res.status(200).json({itineraries:itineraries,placesData:placesData})
    return 
}