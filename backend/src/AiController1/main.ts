import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { generateItinerary } from "./services/Itinerarygen";
import { extractPlaces } from "./services/extractplaces";
import { convertItineraryToText } from "./services/jsontoparagraph";

dotenv.config();

const app = express();
app.use(express.json());

const API_KEY = process.env.GEO_API_KEY;

interface ReqBody {
  destination: string;
  number_of_days: number;
  budget: number;
  number_of_persons: number;
  interests?: string[];
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
    console.error("❌ Error generating itinerary:", error);
    return JSON.stringify({ error: "Internal Server Error" });
  }
}
 export async function extract(req:{itenary:string}){

    try {
      const places = await extractPlaces(req.itenary);
      return JSON.stringify({ success: true, places });
    } catch (error) {
      console.error("❌ Error extracting places:", error);
      JSON.stringify({ error: "Internal Server Error" });
    }
  };

  export async function convertToText(req:any) {
    try {
      const itineraryText = await convertItineraryToText(req.itineraryJSON);  
      return JSON.stringify({ success: true, message: "Itinerary converted and saved successfully!", itineraryText });
    } catch (error) {
      console.error("❌ Error converting itinerary to text:", error);
      JSON.stringify({ error: "Internal Server Error" });
    }
  }
