import "dotenv/config";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "mixtral-8x7b-32768"; // Alternative: "llama3-70b-8192"

export async function extractPlacesAI(filePath: string) {
  try {
    if (!GROQ_API_KEY) throw new Error("Missing GROQ API Key!");

    const rawData = fs.readFileSync(filePath, "utf-8");
    const itineraryData = JSON.parse(rawData);

    if (!itineraryData || !itineraryData.itinerary) {
      throw new Error("Invalid JSON format: 'itinerary' key missing");
    }

   const prompt = `
    You are an AI that extracts **only places** (landmarks, attractions, restaurants, hotels) from a given travel itinerary **along with their specific full,precise locations**.  

    **Strict Extraction Guidelines:**
    1. **Extract only the mentioned places**—do not create new ones.  
    2. **Ensure precise locations** by including city, state, and country (e.g., "Cafe Simla Times, The Mall Road, Shimla, Himachal Pradesh, India").  
    3. **If a place’s location is incomplete**, infer it using the itinerary's context (destination, region).  
    4. **Avoid duplicate entries**—if a place appears multiple times, ensure each entry remains **unique** in that day's itinerary.  
    5. **Maintain a structured JSON format with no extra text.**  
    6. **Use the provided itinerary data** to extract places accurately**.
    7. ** do not include the hotels and restaurant places in the activities for each day means the places in hotels and food are not in the activites for each day don't combine the places **.
    8. ** strictly include landmarks and attractions in the activities for each day don't include hotels,restaurants , rides etc. **.

    ### **Input Itinerary:**  
    \`\`\`json
    ${JSON.stringify(itineraryData, null, 2)}
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

  
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json() as {
      choices: { message: { content: string } }[];
    };
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid AI response");
    }

    const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response is not valid JSON");

    const placesJSON = JSON.parse(jsonMatch[0]);

    // Save extracted places to a JSON file
    const outputFilePath = path.join(__dirname, "places.json");
    fs.writeFileSync(outputFilePath, JSON.stringify(placesJSON, null, 2));

    console.log(`✅ AI-Extracted Places saved to: ${outputFilePath}`);
    return placesJSON;
  } catch (error) {
    console.error("❌ Error extracting places with AI:", error);
    throw error;
  }
}
