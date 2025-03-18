import { PrismaClient } from "@prisma/client";
export async function saveItenary(itenaryString:string,allDayPlaces:any,userId:string) {
    const prisma = new PrismaClient();
    const itenaryJ=await JSON.parse(itenaryString);
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
        for(const dayPlaces of allDayPlaces){
            for(const place of dayPlaces){
                const dayD= await prisma.day.create({
                    data:{
                        dayNumber:place.dayNum,
                        itineraryId:itenaryD.id,
                        morning:JSON.stringify(itenaryJ.days[place.dayNum-1].morning),
                        afternoon:JSON.stringify(itenaryJ.days[place.dayNum-1].afternoon),
                        evening:JSON.stringify(itenaryJ.days[place.dayNum-1].evening),
                        proTip:itenaryJ.days[place.dayNum-1].tips,
                    }
                })

                const placeD= await prisma.place.create({
                    data:{
                        name:place.displayName,
                        address:place.formattedAddress,
                        latitude:place.location.latitude,
                        longitude:place.location.longitude,
                        placeId:place.place_id,
                        day:{
                            connect:{
                                id:dayD.id
                            }
                        }
                    }
                })
                for(const img of place.photos){
                    await prisma.image.create({
                        data:{
                            placeId:placeD.id,
                            imageUrl:img
                        }
                    })
                }
            } 
        }

    }catch(err){
        
    }


}