import { PrismaClient } from "@prisma/client";
import { place } from "../utils/types";

const prisma=new PrismaClient();

export default async function insertPlace(place:place):Promise<{"exist":boolean,"id":string}>{
    try{
        const placeD= await prisma.place.findUnique({
            where:{
                placeId:place.id
            }
        })
        if(placeD) return {"exist":true,"id":placeD.id};
        const placeD2= await prisma.place.create({
            data:{
                name:place.displayName,
                address:place.formattedAddress,
                latitude:place.location.latitude,
                longitude:place.location.longitude,
                placeId:place.id
            }
        })
        return {"exist":false,"id":placeD2.id};
    }catch(err){
        console.error("Error inserting place:",err);
        return {"exist":true,"id":""};
    }
}