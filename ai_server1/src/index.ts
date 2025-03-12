import express, { Request, Response } from "express";
import { generateItinerary } from "./services/genItinerary";
import { extractplaces } from "./services/extractplaces";
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

app.post("/gen-itinerary", async (req: any, res: any) => {
  try {

    // console.log("Request body:", req.body);
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

    //send the json formatted itinerary for conversion of it to paragraph based itinerary fn
    const paraItinerary=await convertItineraryToPara(itinerary.itinerary);

    console.log("Converted Itinerary:",paraItinerary);

    return res.json({ success: true, itinerary ,paraItinerary});//returning both json and paragraph based itinerary

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
