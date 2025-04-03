import { Request, Response } from "express";
import saveReview from "../utils/saveReview";

export const summarizeRoute=async (req:Request,res:Response)=>{
  const {placeId,review}=req.body;
  const {summarizedReview,finalRating} = JSON.parse(review);
  await saveReview(summarizedReview,finalRating,placeId)
  res.status(200).json({message:"Saved to DB"})
  // res.json({summarizedReview,placeId})
}