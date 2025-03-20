import { PrismaClient } from "@prisma/client";
import { placesData } from "./types";
export async function saveItenary(itenaryString:string,allDayPlaces:placesData,userId:string) {
    const prisma = new PrismaClient();
    const itenaryJ=await JSON.parse(itenaryString).itinerary;
    console.log("itenaryJ",itenaryJ);
    try{
        const user= await prisma.user.findFirst({
            where:{
                id:userId
            }
        })
        if(!user) return JSON.stringify({"error":"User not found"})
        const itenaryD= await prisma.itinerary.create({
            data:{
                userId:user.id,
                destination:itenaryJ.destination,
                duration:itenaryJ.number_of_days,
                budget:itenaryJ.budget,
                numberOfPersons:itenaryJ.number_of_persons,
                interests:itenaryJ.interests||[],
            }
        })
        let dayNum=0
        for(const dayPlaces of allDayPlaces){               
                const dayD= await prisma.day.create({
                    data:{
                        dayNumber:dayNum+1,
                        itineraryId:itenaryD.id,
                        morning:JSON.stringify(itenaryJ.days[dayNum].morning),
                        afternoon:JSON.stringify(itenaryJ.days[dayNum].afternoon),
                        evening:JSON.stringify(itenaryJ.days[dayNum].evening),
                        proTip:itenaryJ.days[dayNum].tips,
                    }
                })
            for(const place of dayPlaces){
                if(place.dbId!=""){
                    console.log("place",place);
                    const placeD= await prisma.place.update({
                        where:{
                            id:place.dbId
                        },
                        data:{
                            summarizedReview:place.summarizedReview,
                            day:{
                                connect:{
                                    id:dayD?.id
                                }
                            }
                        }
                    })
                    for(const img of place.photos){
                        await prisma.image.create({
                            data:{
                                placeId:placeD.placeId,
                                imageUrl:img
                            }
                        })
                    }
                }
            } 
            dayNum++;
        }
        return JSON.stringify({"success":"Itinerary saved successfully"})
    }catch(err){
        console.log(err);
        return JSON.stringify({"error":err})
    }


}