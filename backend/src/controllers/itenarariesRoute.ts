import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../utils/types";
import { Response } from "express";
export  function itenarariesRoute(req:AuthRequest,res:Response){
    const prisma = new PrismaClient();
    const user=req.user
    if(!user?.userId){
        res.status(401).json({"error":"Unauthorized:No token provided"})
        return
    }
    const itineraries= prisma.itinerary.findMany({
        where: {
           userId: user.userId
        }, 
        include: {
            days: {
                include: {
                    places: {
                        include: {
                            images: true
                        }
                    }
                }
            }
        }
    })
    res.status(200).json(itineraries)
    return
}