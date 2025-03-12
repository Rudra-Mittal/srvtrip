import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const extractplaces = async (itinerary:any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an AI that extracts **only places** (landmarks, attractions, restaurants, hotels) from a given travel itinerary.  
    **Do NOT create any new places. Only return places from the itinerary below.**  
    The response must be in **strict JSON format**.

    **Input Itinerary (Extract from this only):**  
    \`\`\`json
    ${JSON.stringify(itinerary, null, 2)}
    \`\`\`

    **Expected JSON Format (Do NOT add explanations, just return JSON):**  
    \`\`\`json
    {
      "places": [
        {
          "day": <day_number>,
          "activities": [<list_of_places>],
          "food": [<list_of_restaurants>],
          "hotel": [<list_of_hotels>]
        }
      ]
    }
    \`\`\`

    **Instructions:**  
    - **Extract only place names** (e.g., "Mahakaleshwar Temple", "Cafe Simla Times").  
    - **DO NOT** include transport, costs, or tips.  
    - Ensure output is **valid JSON** with correct formatting.  
    - **DO NOT make up places**. Use only the ones present in the itinerary.  
    `;

    const response = await model.generateContent(prompt);
    const result = response.response;
    const text = result.text().trim();

    const cleanedText = text.replace(/^```json\s*|```$/g, "").trim();

    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Error extracting places from itinerary:", error);
    return { success: false, message: "Failed to extract places from itinerary." };
  }
};