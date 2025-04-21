import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateItinerary = async (
  destination: string,
  number_of_days: number,
  startdate: Date,
  currency: string,
  budget: number,
  number_of_persons: number,
  interests?: string | string[]
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =`
    Before generating the itinerary, if the destination name appears to be misspelled, vague, or invalid, intelligently correct it to the most likely valid city or country name (e.g., "indiad" should be "India", "parisss" should be "Paris", etc.). Use the corrected name in the response.
    Generate a detailed, optimized travel itinerary for a trip to **${destination}** spanning **${number_of_days}** days, starting from **${startdate}**.
    The total budget for this trip is **${currency} ${budget}**, and it is planned for **${number_of_persons}** people.
    ${interests ? `Interests to consider: ${interests}. Take it as a priority.` : ""}

    ### **Strict Budget Utilization Guidelines:**
    - **Ensure optimal use of the budget**—avoid excessive leftover amounts. The remaining budget should be **reasonably low** while maintaining quality accommodations, food, and experiences.
    - **Distribute expenses efficiently** across accommodation, food, transport, and activities.
    - **Do not exceed the given budget**, but also do not leave more than **25-30% of the budget unspent** unless necessary.
    - **Prioritize quality experiences that match** the budget rather than overly cheap options.

    ### **Location Accuracy Requirements:**
    - Each **activity, restaurant, and transport mode** should include the **place name along with the city or district only** in the format **#Place Name, City/District#**.
    - Food recommendations must include the **specific restaurant name and city/district only** in the format **#Restaurant Name, City/District#**.
    - **Transport details must specify pick-up/drop-off points** in the format **#Transport Location, City/District#**.

    ### **Itinerary Structure:**
    - Each day's plan must be structured into **morning, afternoon, and evening** sections.
    - Include **food, transport, and cost breakdown** within each section.
    - **Provide a total budget estimation** at the end, summing up all costs.

    ### **Strict JSON Format**:
    \`\`\`json
    {
      "itinerary": {
        "destination": "${destination}",
        "number_of_days": ${number_of_days},
        "start_date": "${startdate}",
        "budget": "${budget}",
        "currency": "${currency}",
        "number_of_persons": ${number_of_persons},
        "interests": ${interests},
        "days": [
          {
            "day": 1,
            "morning": {
              "activities": "Arrive in #Hotel Combermere, Shimla# and explore #Mall Road, Shimla#.",
              "food": "Breakfast at #Indian Coffee House, Shimla# - ${currency} 250 per person.",
              "transport": "Taxi from #Jubbarhatti Airport, Shimla# to #Hotel Combermere, Shimla# - ${currency} 800 total.",
              "cost": "${currency} 1,050"
            },
            "afternoon": {
              "activities": "Visit #The Ridge, Shimla# and #Christ Church, Shimla# for scenic views and photography.",
              "food": "Lunch at #Wake & Bake Café, Shimla# - ${currency} 600 per person.",
              "transport": "Walking tour.",
              "cost": "${currency} 600"
            },
            "evening": {
              "activities": "Enjoy a fine dining experience at #Eighteen71 Cookhouse & Bar, Shimla#.",
              "food": "North Indian & Chinese cuisine - ${currency} 800 per person.",
              "transport": "Auto-rickshaw from #The Ridge, Shimla# to #Eighteen71 Cookhouse & Bar, Shimla# - ${currency}150.",
              "cost": "${currency}950"
            },
            "budget_breakdown": "${currency} 3,100",
            "tips": "Explore #Mall Road, Shimla# in the evening for a lively atmosphere. Arrive early at #The Ridge, Shimla# for better photos."
          }
        ],
        "total_budget_used": "${currency} X,XXX",
        "remaining_budget": "${currency} X,XXX"
      }
    }
    \`\`\`

    Ensure that the itinerary is engaging, **realistic**, and structured to provide a **seamless travel experience**.  
    It must be in **valid JSON format with no extra text**.
    `;


    const response = await model.generateContent(prompt);
    const result = response.response;
    const text = result.text().trim();

    const cleanedText = text.replace(/^```json\s*|```$/g, "").trim();

    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Error generating itinerary:", error);
    return { success: false, message: "Failed to generate itinerary." };
  }
};