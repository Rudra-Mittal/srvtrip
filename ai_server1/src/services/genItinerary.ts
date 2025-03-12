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

    const prompt = `
      Generate a detailed, optimized travel itinerary for a trip to ${destination} spanning ${number_of_days} days.
      The budget for this trip is ₹${budget}, and it is planned for ${number_of_persons} people.
      ${interests ? `Interests to consider: ${interests}.` : "Interests are optional."}

      Each day's plan must be structured into **morning, afternoon, and evening** activities, and the response **must be valid JSON with no extra text**.

      ### **Strict JSON Format**:
      \\u0060\\u0060\\u0060json
      {
        "itinerary": [
          {
            "day": 1,
            "morning": {
              "activities": "Arrive in Shimla, check into Hotel Combermere, and explore Mall Road.",
              "food": "Breakfast at Indian Coffee House (₹250 per person).",
              "transport": "Taxi from airport to hotel (₹800 total).",
              "cost": "₹1,050"
            },
            "afternoon": {
              "activities": "Visit The Ridge and Christ Church for scenic views.",
              "food": "Lunch at Wake & Bake Café (₹600 per person).",
              "transport": "Walking tour.",
              "cost": "₹600"
            },
            "evening": {
              "activities": "Dinner at 8INE rooftop restaurant.",
              "food": "North Indian/Chinese cuisine (₹800 per person).",
              "transport": "Auto-rickshaw to restaurant (₹150).",
              "cost": "₹950"
            },
            "budget_breakdown": "₹3,100",
            "tips": "Best to explore Mall Road in the evening for a lively atmosphere."
          }
        ]
      }
      \\u0060\\u0060\\u0060

      ### **Response Instructions**:
      - The response **must be valid JSON** without extra text, explanations, or preambles.
      - Do **not** include phrases like “Sure, here’s your itinerary” or “I hope this helps.”
      - The response **must begin with { and end with }** (strict JSON format).
      - **Each day's itinerary must include:** morning, afternoon, and evening plans with activities, food, transport, cost, and travel tips.
      - **Multiply costs for ${number_of_persons} people** when necessary.

      **Ensure the response is directly usable as JSON. Do not provide any non-JSON text.**
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