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
    const startdate = itenaryJ.start_date || itenaryJ.startdate || new Date().toISOString().split('T')[0];
    
    console.log("Creating itinerary with data:", {
        destination: itenaryJ.destination,
        duration: itenaryJ.number_of_days,
        budget: parseFloat(itenaryJ.budget),
        numberOfPersons: itenaryJ.number_of_persons,
        interests: itenaryJ.interests || [],
        startdate
    });
    // console.log(itenaryJ);
    const itenaryD=await prisma.itinerary.create({
    data:{
            userId:userId,
            destination:itenaryJ.destination,
            duration:itenaryJ.number_of_days,
            budget:parseFloat(itenaryJ.budget),
            numberOfPersons:itenaryJ.number_of_persons,
            interests:itenaryJ.interests||[],
            startdate:itenaryJ.startdate,
        }
    })
    return itenaryD.id;
}