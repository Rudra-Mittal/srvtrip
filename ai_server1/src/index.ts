import express, { Request, Response } from "express";
import { generateItinerary } from "./services/genItinerary";

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
    console.log("khcwvhsvchhjsbbjk");
  try {

    console.log("Request body:", req.body);
    const { destination, number_of_days, budget, number_of_persons, interests } =req.body;
    console.log(destination, number_of_days, budget, number_of_persons, interests);

    // Validate the request body
    if (!destination || !number_of_days || !budget || !number_of_persons) {
      return res.status(400).json({
        error: "Missing required fields: destination, number_of_days, budget, number_of_persons",
      });
    }

    // Generate itinerary by calling the AI model
    const itinerary = await generateItinerary(destination, number_of_days, budget, number_of_persons, interests);
    console.log("Generated itinerary:", itinerary);

    return res.json({ success: true, itinerary });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
