import { Request, Response } from "express";
import { searchQuery } from "../utils/getSimilar";

export const queryRoute=(req:Request,res:Response)=>{
  const {query,placeName,limit}=req.body;
  searchQuery(query,placeName,limit)
  .then((result)=>{
      res.send(result)
  })  
  .catch((err)=>{
      console.log(err)
      res.json({"error":"Server err"})
  })
}