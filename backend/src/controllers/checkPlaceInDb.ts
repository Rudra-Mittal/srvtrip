import { PrismaClient } from "@prisma/client";
import { place } from "../utils/types";

const prisma=new PrismaClient();

export default async function checkPlace(place:place):Promise<{"id":string}>{
    try{
        const placeD= await prisma.place.findUnique({
            where:{
                placeId:place.id
            },
        })
        if(placeD) return {"id":placeD.id};
        return {"id":""};
    }catch(err){
        console.error("Error inserting place:",err);
        return {"id":""};
    }
}