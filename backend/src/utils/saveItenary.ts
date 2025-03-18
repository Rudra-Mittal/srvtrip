import { PrismaClient } from "@prisma/client";
export async function saveItenary(itenaryString:string,placeData:any,userId:string) {
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
        const days= await prisma.day.createManyAndReturn({
            data:[

            ]
        })

    }catch(err){
        
    }


}