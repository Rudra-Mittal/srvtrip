import { Response } from "express";
import { AuthRequest } from "../../utils/types";

export const userRoute=(req:AuthRequest,res:Response)=>{
  //i want to send the userId in the response to frontend so that routes on frontend can be protected
  const userId = req.user?.userId;//get userId from token
  if(!userId){
    res.status(403).json({"error":"User not found"});
    return
  }
  res.status(200).json({userId});
  return
}