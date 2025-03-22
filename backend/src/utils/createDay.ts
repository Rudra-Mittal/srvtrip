import { PrismaClient } from "@prisma/client";

export default async function createDay(dayNum: number, itenaryid: string,itenary:string): Promise<string> {
    const prisma = new PrismaClient();
    const itenaryJ= await JSON.parse(itenary).itinerary;
    const dayD = await prisma.day.create({
                data:{
                        dayNumber:dayNum+1,
                        itineraryId:itenaryid,
                        morning:JSON.stringify(itenaryJ.days[dayNum].morning),
                        afternoon:JSON.stringify(itenaryJ.days[dayNum].afternoon),
                        evening:JSON.stringify(itenaryJ.days[dayNum].evening),
                        proTip:itenaryJ.days[dayNum].tips,
                }
    })
    if (dayD.id) return dayD.id;
    return "";
}