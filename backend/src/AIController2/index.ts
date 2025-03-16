import express, { Request, Response } from "express";
import { generateItinerary } from "./services/genItinerary";
import { extractPlacesByRegex } from "./services/extractPlacesbyRegex";
import { convertItineraryToPara } from "./services/convertItineraryToPara";


const app = express();
app.use(express.json());

interface ReqBody {
  destination: string;
  number_of_days: number;
  budget: number;
  number_of_persons: number;
  interests?: string;
}

export async function generate(req:ReqBody){
  try {
    const { destination, number_of_days, budget, number_of_persons, interests } = req;
    if (!destination || !number_of_days || !budget || !number_of_persons) {
      return JSON.stringify({ error: "Missing required fields: destination, number_of_days, budget, number_of_persons" });
    }

    const itinerary = await generateItinerary(destination, number_of_days, budget, number_of_persons, interests);

    return JSON.stringify(itinerary);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return JSON.stringify({ error: "Internal Server Error" });
  }
}

export function extract(req:{itinerary:string}){
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
