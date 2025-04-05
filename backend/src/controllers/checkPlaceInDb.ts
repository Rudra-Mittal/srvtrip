import { PrismaClient } from "@prisma/client";
import { place } from "../utils/types";

const prisma=new PrismaClient();

export default async function checkPlaceAndReturnPhotos(place:place):Promise<{"images":{"imageUrl":string}[],id:string|null}>{
    try{
        const placeD= await prisma.place.findUnique({
            where:{
                placeId:place.id
            },
            select:{
                id:true,
                images:{
                    select:{
                        imageUrl:true
                    }
                }
            }
        })
        console.log(placeD)
        if(placeD) return placeD;
        return {"id":null,"images":[]};
    }catch(err){
        console.error("Error finding place:",err);
        return {"id":null,"images":[]};
    }
}