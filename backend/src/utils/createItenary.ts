import { PrismaClient } from "@prisma/client";

export default async function createItenary(itenary:string,userId:string):Promise<string|null>{
    const prisma=new PrismaClient();
    const itenaryJ=JSON.parse(itenary).itinerary;
    console.log("Itinerary JSON:", itenaryJ);
    const user= await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user)
        {
            console.log("User not found");
            return null;
        } 
    const startdate = itenaryJ.start_date || itenaryJ.startdate || new Date().toISOString().split('T')[0];
    
    console.log("Creating itinerary with data:", {
        destination: itenaryJ.destination,
        duration: itenaryJ.number_of_days,
        budget: parseFloat(itenaryJ.budget),
        numberOfPersons: itenaryJ.number_of_persons,
        interests: itenaryJ.interests || [],
        startdate,
        totalBudgetUsed: itenaryJ.total_budget_used,
        remainingBudget: itenaryJ.remaining_budget,
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
            totalBudgetUsed:itenaryJ.total_budget_used,
            remainingBudget:itenaryJ.remaining_budget,
        }
    })
    return itenaryD.id;
}