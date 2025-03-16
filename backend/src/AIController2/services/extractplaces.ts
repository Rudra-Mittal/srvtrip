import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const extractplaces = async (itinerary:any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an AI that extracts **only places** (landmarks, attractions, restaurants, hotels) from a given travel itinerary **along with their specific full,precise locations**.  

    **Strict Extraction Guidelines:**
    1. **Extract only the mentioned places**—do not create new ones.  
    2. **Ensure precise locations** by including city, state, and country (e.g., "Cafe Simla Times, The Mall Road, Shimla, Himachal Pradesh, India").  
    3. **If a place’s location is incomplete**, infer it using the itinerary's context (destination, region).  
    4. **Avoid duplicate entries**—if a place appears multiple times, ensure each entry remains **unique** in that day's itinerary.  
    5. **Maintain a structured JSON format with no extra text.**  

    ### **Input Itinerary:**  
    \`\`\`json
    ${JSON.stringify(itinerary, null, 2)}
    \`\`\`

    ### **Expected JSON Output:**  
    \`\`\`json
    {
      "places": [
        {
          "day": <day_number>,
          "activities": [
            {
              "name": "<Place Name>",
              "location": "<Full Address or City, State, Country>"
            }
          ],
          "food": [
            {
              "name": "<Restaurant Name>",
              "location": "<Full Address or City, State, Country>"
            }
          ],
          "hotel": [
            {
              "name": "<Hotel Name>",
              "location": "<Full Address or City, State, Country>"
            }
          ]
        }
      ]
    }
    \`\`\`

    ### **Final Instructions:**  
    - **No extra text, explanations, or formatting errors—only return JSON.**  
    - **Ensure accuracy in place names and locations.**  
    - **If a place appears multiple times in a day, list it only once.**  
    - **Each place should have a unique and correctly formatted address.**  
    - **Keep the response structured exactly as shown above.**  
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