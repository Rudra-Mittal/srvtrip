import { Response } from "express";
import { AuthRequest } from "../../utils/types";

export const userRoute=(req:AuthRequest,res:Response)=>{
  //i want to send the userId in the response to frontend so that routes on frontend can be protected
  const user = req.user;//get userId from token
  if(!user?.userId){
    res.status(403).json({"error":"User not found"});
    return
  }
  res.status(200).json({userId:user.userId,email:user.email,name:user.name})//send userId in response;
  return
}