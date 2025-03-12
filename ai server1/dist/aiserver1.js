"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "mixtral-8x7b-32768"; // Alternative: "llama3-70b-8192"
function generateItinerary(destination, totalBudget, persons, interests, days, foodPreference) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (!GROQ_API_KEY)
                throw new Error("Missing GROQ API Key!");
            const prompt = `
    Generate a detailed, optimized travel itinerary for a trip to ${destination} spanning ${days} days.
    The budget for this trip is ₹${totalBudget}, and it is planned for ${persons} people.
    ${interests.length > 0 ? `Interests to consider: ${interests.join(", ")}. Take it as a priority.` : ""}

    Each day's plan must be structured into *morning, afternoon, and evening* activities, and the response *must be valid JSON with no extra text*.

    ### *Strict JSON Format*:
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

    ### *Response Instructions*:
    - The response *must be valid JSON* without extra text, explanations, or preambles.
    - Do *not* include phrases like “Sure, here’s your itinerary” or “I hope this helps.”
    - The response *must begin with { and end with }* (strict JSON format).
    - *Each day's itinerary must include:* morning, afternoon, and evening plans with activities, food, transport, cost, and travel tips.
    - *Multiply costs for ${persons} people* when necessary.

    *Ensure the response is directly usable as JSON. Do not provide any non-JSON text.*
  `;
            const response = yield fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [{ role: "system", content: prompt }],
                    temperature: 0.85,
                }),
            });
            const data = yield response.json();
            if (!data.choices || !((_b = (_a = data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content)) {
                throw new Error("Invalid response from AI API");
            }
            const itineraryJSON = JSON.parse(data.choices[0].message.content);
            console.log("🗺️ AI-Generated JSON Itinerary:\n", JSON.stringify(itineraryJSON, null, 2));
            return itineraryJSON;
        }
        catch (error) {
            console.error("❌ Error generating itinerary:", error);
        }
    });
}
// 🔥 Example Usage
generateItinerary("Haridwar", 400000, 4, ["Luxury", "Camel", "Scuba Diving"], 5, "Veg");
