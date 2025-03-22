import { PrismaClient } from "@prisma/client";

export default async function createItenary(itenary:string,userId:string):Promise<string|null>{
    const prisma=new PrismaClient();
    const itenaryJ=JSON.parse(itenary).itinerary;
    const user= await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user) return null;
    console.log(itenaryJ);
    const itenaryD=await  prisma.itinerary.create({
        data:{
            userId:userId,
            destination:itenaryJ.destination,
            duration:itenaryJ.number_of_days,
            budget:itenaryJ.budget,
            numberOfPersons:itenaryJ.number_of_persons,
            interests:itenaryJ.interests||[],
        }
    })
    return itenaryD.id;
}