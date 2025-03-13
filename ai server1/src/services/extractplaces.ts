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
    Extract **only place names** from this travel itinerary and categorize them **day-wise**.

        **❌ STRICTLY EXCLUDE:**
    - **Transport modes** (e.g., "Toy Train Ride", "Bus Journey", "Car Rental")
    - **Experiences & Activities** (e.g., "Hot Air Balloon Ride", "Camel Ride", "Scuba Diving", "Paragliding")
    - **Generic phrases** (e.g., "City Tour", "Local Market" without a specific name)
    - **Events & Services** (e.g., "Live Music Night", "Cultural Show", "Cooking Class")
  
    **✅ INCLUDE ONLY:**
    - Hotels
    - Restaurants, cafés, dhabas
    - Landmarks, monuments
    - Markets
    -  beaches

    **📝 STRICT JSON FORMAT (Example Output):**
    {
      "places": [
        {
          "day": 1,
          "morning": ["Taj Mahal", "Shiv Café"],
          "afternoon": ["Agra Fort", "Pind Balluchi Restaurant"],
          "evening": ["Mehtab Bagh", "JW Marriott Hotel"],
          "night": ["ITC Mughal"]
        },
        {
          "day": 2,
          "morning": ["Hawa Mahal", "Laxmi Misthan Bhandar"],
          "afternoon": ["Amber Fort", "Samode Haveli"],
          "evening": ["Nahargarh Fort", "Tapri Tea House"],
          "night": ["Rambagh Palace"]
        }
      ]
    }
  
    **⚠️ INSTRUCTIONS FOR AI:**
    - **Remove any transport-related entries** like "Toy Train Ride", "Bus Tour".
    - **Remove all activities & experiences** like "Hot Air Balloon Ride", "Paragliding".
    - **Ensure JSON format is followed strictly** (no explanations, no extra text).
  
    **Now process the following itinerary JSON:**
    ${JSON.stringify(itineraryData)}
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
