import { PrismaClient } from "@prisma/client"
import { place } from "./types"

export default async function createPlace(place: place,dayId:string,photos:string[]): Promise<string|null> { 
    const prisma= new PrismaClient()
    
    try{
        const placeD= await prisma.place.create({
            data:{
                name:place.displayName,
                address:place.formattedAddress,
                latitude:place.location.latitude,
                longitude:place.location.longitude,
                placeId:place.id,
                day:{
                    connect:{
                        id:dayId
                    }
                },
                images:{
                    createMany:{
                        data: photos.map((imgUrl:string)=>{return {imageUrl:imgUrl}})
                    }
                }
            }
        })
        if(placeD.id) return placeD.id;
        return "";
    }catch(err){
        console.error("Error inserting place:",err);
        return null;
    }
}