//types for placesData (2D array having each idx as array of places of that day and places is in object)

import { Request } from "express";

export interface place{
    dbId:string,//differentiator
    exist:boolean,
    placename:string,
    id:string,
    formattedAddress:string,
    displayName:string,
    location:{
        latitude:number,
        longitude:number
    },
    photos:string[],
    summarizedReview:string
}
export type day= place[];
//placesData will array of type day
export type placesData=day[];

// Define a custom interface extending Express Request
export interface AuthRequest extends Request {
    cookies: any;
    user?: {
      userId: string;
      // Add other properties from your JWT payload if needed
    };
  }

