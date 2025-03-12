import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const convertItineraryToPara = async (itinerary:any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const itineraryString = JSON.stringify(itinerary, null, 2); // Properly formatted JSON string

    const prompt =`
    You are an AI that converts a detailed travel itinerary in JSON format to a paragraph-based itinerary.
    Convert the following JSON-formatted itinerary into a well-structured, detailed paragraph format while maintaining the day-wise breakdown. Each day should be described in a natural, travel-friendly manner, covering all aspects of the trip, including activities, food, transportation, and budget.

    **Format Requirements:**
    1. **Start each day's description with "Day X"** to keep it structured.
    2. **Describe morning, afternoon, and evening separately**, keeping a natural flow.
    3. **Merge details naturally into engaging sentences**, avoiding a direct list format.
    4. **Include food, transport, and budget details** within the flow of each section.
    5. **Keep travel tips at the end of each day's description.**

    **Example Conversion Format:**
    ---
    **Day 1:**  
    The journey begins with an arrival at Devi Ahilyabai Holkar Airport in Indore. From here, a pre-booked taxi ensures a smooth transfer to Ujjain, taking approximately an hour. After checking into Hotel Anjushree (₹4000/night), travelers can freshen up before heading out for the day's adventures. Breakfast is enjoyed at Indore Airport, costing around ₹300 per person.

    In the afternoon, visitors proceed to the sacred Mahakaleshwar Temple for darshan, with a priority pass booked in advance to save time. A traditional Gujarati Thali lunch at Damodar Restaurant (₹400 per person) provides a hearty meal before exploring further. Auto-rickshaws, available for ₹300, make transportation between the hotel and temple convenient.

    As evening approaches, the mesmerizing Bhasma Aarti at Mahakaleshwar Temple is a must-see experience (₹200 per person, prior booking required). Afterward, travelers can explore the bustling local markets surrounding the temple. A delightful dinner at Hariyali Restaurant (₹600 per person) concludes the day's experiences. Walking back from the market allows visitors to soak in the vibrant atmosphere before returning to their accommodation.

    **Budget Summary for the Day:** ₹8800  
    **Pro Tips:** Book the Bhasma Aarti and priority darshan passes well in advance. Dress modestly for temple visits and be cautious of pickpockets in crowded areas.  

    ---
    Now, using this format, convert the given JSON itinerary into a well-structured, readable travel itinerary.  
    **Here is the JSON itinerary:**  

    ${itineraryString}

        `;

    const response = await model.generateContent(prompt);
    const result = response.response;
    const text = result.text().trim();

    return text;

  } catch (error) {
    console.error("Error converting itinerary in json format to para:", error);
    return { success: false, message: "Failed to convert itinerary in json format to para" };
  }
};