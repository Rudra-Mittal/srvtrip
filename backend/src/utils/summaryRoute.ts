import { PrismaClient } from "@prisma/client";
import e from "express";

const prisma= new PrismaClient();
export function summaryRoute(req: any, res: any) {
    try{
        // console.log(req)
    const {placeid}= req.query;
    if(!placeid){
        res.status(400).json({error:"Place ID is required"})
        return
    }
    console.log("Place ID:", placeid);
    interface SummarizedReviewData {
        summarizedReview: string | null;
    }

    interface ErrorResponse {
        error: string;
    }

    interface SuccessResponse {
        summarizedReview: string;
    }

    prisma.place.findFirst({
        where: {
            placeId: placeid
        },
        select: {
            summarizedReview: true,
        }
    }).then((data: SummarizedReviewData | null) => {
        // console.log("Data fetched from DB:", data);
        if (data?.summarizedReview) {
            res.status(200).json({ summarizedReview: data.summarizedReview });
        } else {
            res.status(404).json({ error: "No summary found" });
        }
        return;
    }).catch((error: Error) => {
        // console.error("Error fetching summary:", error);
        res.status(500).json({ error: "DB Error" });
        return;
    })
   }catch(error){
        // console.error("Error in summaryRoute:", error);
        res.status(500).json({error:"Internal Server Error"})
        return
   }
}