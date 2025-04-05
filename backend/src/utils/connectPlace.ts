import { PrismaClient } from "@prisma/client";

export default async function connectPlace(placeId:string,dayId:string):Promise<string|null>{
    const prisma=new PrismaClient();
    try{
        const placeD= await prisma.place.update({
                            where:{
                                id:placeId
                            },
                            data:{
                                day:{
                                    connect:{
                                    id:dayId
                    }
                }
            }
        })
        return placeD.id;
    }catch(err){
        console.error("Error connecting place:",err);
        return null
    }
}