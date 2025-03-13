import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { generateItinerary } from "./services/Itinerarygen";
import { extractPlacesAI } from "./services/extractplaces"; // Import the extraction function
import { convertItineraryToText } from "./services/jsontoparagraph"; // Import AI conversion function

dotenv.config();

const app = express();
app.use(express.json());

const API_KEY = process.env.GEO_API_KEY; // Ensure you have the API key in .env

interface ReqBody {
  destination: string;
  number_of_days: number;
  budget: number;
  number_of_persons: number;
  interests?: string[];
}

// Route to generate itinerary
app.post("/gen-itinerary", async (req: any, res: any) => {
  try {
    const { destination, number_of_days, budget, number_of_persons, interests } = req.body as ReqBody;

    if (!destination || !number_of_days || !budget || !number_of_persons) {
      return res.status(400).json({
        error: "Missing required fields: destination, number_of_days, budget, number_of_persons",
      });
    }

    const itinerary = await generateItinerary(destination, number_of_days, budget, number_of_persons, interests);

    const filePath = path.join(__dirname, "generated_itinerary.json");
    fs.writeFileSync(filePath, JSON.stringify(itinerary, null, 2));

    return res.json({ success: true, itinerary, message: "Itinerary saved successfully!" });
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to extract places from the itinerary
app.get("/extract-places", async (req: any, res: any) => {
  try {
    const filePath = path.join(__dirname, "generated_itinerary.json");

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "No itinerary found. Please generate one first!" });
    }

    const places = await extractPlacesAI(filePath);
    return res.json({ success: true, places });
  } catch (error) {
    console.error("❌ Error extracting places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **New Route to Convert JSON Itinerary to Text and Save it**
app.get("/convert-itinerary", async (req: any, res: any) => {
  try {
    const jsonFilePath = path.join(__dirname, "generated_itinerary.json");

    if (!fs.existsSync(jsonFilePath)) {
      return res.status(400).json({ error: "No itinerary found. Please generate one first!" });
    }

    const itineraryJSON = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

    // Convert JSON to readable text using AI
    const itineraryText = await convertItineraryToText(itineraryJSON);

    // Save the output to a text file
    const textFilePath = path.join(__dirname, "generated_itinerary.txt");
    fs.writeFileSync(textFilePath, itineraryText, "utf-8");

    return res.json({
      success: true,
      message: "Itinerary converted and saved successfully!",
      textFilePath,
    });
  } catch (error) {
    console.error("❌ Error converting itinerary to text:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
