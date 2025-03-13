import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateItinerary = async (
  destination: string,
  number_of_days: number,
  budget: number,
  number_of_persons: number,
  interests?: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =`
    Generate a detailed, optimized travel itinerary for a trip to **${destination}** spanning **${number_of_days}** days.
    The total budget for this trip is **₹${budget}**, and it is planned for **${number_of_persons}** people.
    ${interests ? `Interests to consider: ${interests}. Take it as a priority.` : ""}

    ### **Strict Budget Utilization Guidelines:**
    - **Ensure optimal use of the budget**—avoid excessive leftover amounts. The remaining budget should be **reasonably low** while maintaining quality accommodations, food, and experiences.
    - **Distribute expenses efficiently** across accommodation, food, transport, and activities.
    - **Do not exceed the given budget**, but also do not leave more than **20-25% of the budget unspent** unless necessary.
    - **Prioritize quality experiences** that match the budget rather than overly cheap options.

    ### **Location Accuracy Requirements:**
    - Each **activity, restaurant, and transport mode** should include the **exact name and location** (e.g., landmarks, area names, or full addresses if available).
    - Food recommendations must include the **specific restaurant name and address**.
    - **Transport details must specify pick-up/drop-off points** to ensure clarity.
      
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
        "budget": ${budget},
        "number_of_persons": ${number_of_persons},
        "days": [
          {
            "day": 1,
            "morning": {
              "activities": "Arrive in Shimla, check into Hotel Combermere (Opposite Tourism Lift, The Mall, Shimla), and explore Mall Road.",
              "food": "Breakfast at Indian Coffee House (33, Mall Road, Middle Bazar, Shimla) - ₹250 per person.",
              "transport": "Taxi from Jubbarhatti Airport (Shimla) to Hotel Combermere - ₹800 total.",
              "cost": "₹1,050"
            },
            "afternoon": {
              "activities": "Visit The Ridge (The Mall, Shimla) and Christ Church (The Ridge, Shimla) for scenic views and photography.",
              "food": "Lunch at Wake & Bake Café (34/1, Mall Road, Middle Bazar, Shimla) - ₹600 per person.",
              "transport": "Walking tour.",
              "cost": "₹600"
            },
            "evening": {
              "activities": "Enjoy a fine dining experience at Eighteen71 Cookhouse & Bar (Hotel Willow Banks, The Mall, Shimla).",
              "food": "North Indian & Chinese cuisine - ₹800 per person.",
              "transport": "Auto-rickshaw from The Ridge to Eighteen71 Cookhouse & Bar - ₹150.",
              "cost": "₹950"
            },
            "budget_breakdown": "₹3,100",
            "tips": "Explore Mall Road in the evening for a lively atmosphere. Arrive early at The Ridge for better photos."
          }
        ],
        "total_budget_used": "₹X,XXX",
        "remaining_budget": "₹X,XXX"
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