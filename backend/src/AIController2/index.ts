import express, { Request, Response } from "express";
import { generateItinerary } from "./services/genItinerary";
import { extractPlacesByRegex } from "./services/extractPlacesbyRegex";
import { convertItineraryToPara } from "./services/convertItineraryToPara";


const app = express();
app.use(express.json());

interface ReqBody {
  destination: string;
  number_of_days: number;
  start_date: string;
  currency: string;
  budget: number;
  number_of_persons: number;
  interests?: string;
}

export async function generate2(req:ReqBody){
  try {
    const { destination, number_of_days,start_date,currency, budget, number_of_persons, interests } = req;
    if (!destination || !number_of_days || !budget || !number_of_persons) {
      return JSON.stringify({ error: "Missing required fields: destination, number_of_days, budget, number_of_persons" });
    }

    const itinerary = await generateItinerary(destination, number_of_days,start_date,currency, budget, number_of_persons, interests);
    
    console.log("Generated itinerary:", itinerary.itinerary);
    return JSON.stringify(itinerary);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return JSON.stringify({ error: "Internal Server Error" });
  }
}
// generate2({destination:"Haridwar",number_of_days:3,start_date:"05-04-2025",currency:"USD",budget:2000,number_of_persons:2,interests:"Adventure, Culture, Food"});

export function extract2(req:{itinerary:string}){
    try {
      const places = extractPlacesByRegex(req.itinerary);
      return JSON.stringify({ success: true, places });
    } catch (error) {
      console.error("Error extracting places:", error);
      JSON.stringify({ error: "Internal Server Error" });
    }
};

export async function convertToText(req:any) {
    try {
      const itineraryText = await convertItineraryToPara(req.itineraryJSON);  
      return JSON.stringify({ success: true, message: "Itinerary converted!", itineraryText });
    } catch (error) {
      console.error(" Error converting itinerary to text:", error);
      JSON.stringify({ error: "Internal Server Error" });
    }
}
