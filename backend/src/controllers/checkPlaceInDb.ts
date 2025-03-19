import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();

export default async function checkPlaceInDb(placeId:string){
    if(await prisma.place.findUnique({
        where:{
            placeId:placeId
        }
    })) return true;

    else return false;
}