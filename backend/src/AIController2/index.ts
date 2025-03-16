import express, { Request, Response } from "express";
import { generateItinerary } from "./services/genItinerary";
import { extractplaces } from "./services/extractplaces";
import { convertItineraryToPara } from "./services/convertItineraryToPara";
import fs from "fs";
import path from "path";
import { extractPlacesbyRegex } from "./services/extractPlacesbyRegex";

const app = express();
app.use(express.json());

interface ReqBody {
  destination: string;
  number_of_days: number;
  budget: number;
  number_of_persons: number;
  interests?: string;
}

app.post("/gen-itinerary", async (req: any, res: any) => {
  try {

    const { destination, number_of_days, budget, number_of_persons, interests } =req.body as ReqBody;
    console.log(destination, number_of_days, budget, number_of_persons, interests);

    // Validate the request body
    if (!destination || !number_of_days || !budget || !number_of_persons) {
      return res.status(400).json({
        error: "Missing required fields: destination, number_of_days, budget, number_of_persons",
      });
    }

    // Generate itinerary by calling the AI model
    const itinerary = await generateItinerary(destination, number_of_days, budget, number_of_persons, interests);
    console.log("Generated itinerary:", itinerary.itinerary);

    // Convert the itinerary to a JSON string
    const itineraryJson = JSON.stringify(itinerary, null, 2);

    // Define the file path
    const filePath = path.join(__dirname, "../itinerary.json");

    // Save the JSON data to a file
    fs.writeFileSync(filePath, itineraryJson, "utf-8");

    console.log("Itinerary saved to itinerary.json");

    // Wait for a short delay to ensure the file is written
    await new Promise((resolve) => setTimeout(resolve, 500));

    //call the extractplaces using regex fn to extract places from the generated itinerary
    const places=extractPlacesbyRegex();

    return res.json({ success: true, itinerary,places });//returning only json itinerary

  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/extract-places",async(req:any,res:any)=>{
  try{
    const {itinerary}=req.body;

    if(!itinerary){
      return res.status(400).json({
        error:"Missing required fields: itinerary"
      });
    }

    let places=await extractplaces(itinerary);
    console.log("Extracted places:",places.places);
    return res.json({success:true,places});
  }
  catch(error){
    console.error("Error extracting places from itinerary:",error);
    res.status(500).json({error:"Internal Server Error"});
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
