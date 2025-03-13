import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { generateItinerary } from "./services/Itinerarygen";
import { extractPlacesAI } from "./services/extractplaces"; // Import the extraction function

const app = express();
app.use(express.json());

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
    console.log(destination, number_of_days, budget, number_of_persons, interests);

    if (!destination || !number_of_days || !budget || !number_of_persons) {
      return res.status(400).json({
        error: "Missing required fields: destination, number_of_days, budget, number_of_persons",
      });
    }

    const itinerary = await generateItinerary(destination, number_of_days, budget, number_of_persons, interests);
    console.log("Generated itinerary:", itinerary);

    const filePath = path.join(__dirname, "generated_itinerary.json");

    fs.writeFileSync(filePath, JSON.stringify(itinerary, null, 2));

    console.log(`📝 Itinerary saved to ${filePath}`);

    return res.json({ success: true, itinerary, message: "Itinerary saved successfully!" });
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🆕 Route to extract places from the itinerary
app.get("/extract-places", async (req: any, res: any) => {
  try {
    const filePath = path.join(__dirname, "generated_itinerary.json");

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "No itinerary found. Please generate one first!" });
    }

    const places = await extractPlacesAI(filePath); // Extract places using AI
    return res.json({ success: true, places });
  } catch (error) {
    console.error("❌ Error extracting places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
