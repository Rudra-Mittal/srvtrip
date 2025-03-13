import "dotenv/config";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "mixtral-8x7b-32768"; // Alternative: "llama3-70b-8192"

export async function generateItinerary(
  destination: string,
  days: number,
  totalBudget: number,
  persons: number,
  interests?: string[]
) {
  try {
    if (!GROQ_API_KEY) throw new Error("Missing GROQ API Key!");

    const interestText =
      interests && interests.length > 0
        ? `Focus on activities related to these interests: **${interests.join(
            ", "
          )}**. Ensure at least **60%** of the itinerary aligns with these while keeping diversity.`
        : "Ensure a **balanced** mix of sightseeing, cultural experiences, local food, adventure, and relaxation.";

    const prompt = `
      You are an expert travel planner. **Design an engaging, optimized, and budget-friendly itinerary** for a trip to **${destination}**, making sure all locations are real and available on **Google Maps**.

      ### **📌 Trip Overview:**
      - **Destination:** ${destination} 📍
      - **Duration:** ${days} days 📆
      - **Travelers:** ${persons} person(s) 👥
      - **Total Budget:** ₹${totalBudget} 💰 (**Must be evenly distributed across the trip**)
      - **Special Interests:** ${interestText}
      
      ### **🎯 Itinerary Guidelines:**
      1. **Accurate Locations:** Every location (attraction, restaurant, hotel, etc.) **must exist on Google Maps**. Provide the **exact name** to ensure easy lookup.
      2. **Daily Plan Structure:** Each day must have **morning, afternoon, and evening** activities.
      3. **Local Food & Culture:** Include **authentic experiences** such as local cuisine, street food, or cultural events.
      4. **Budget Breakdown:** Provide the cost per activity, food, and transport. **Multiply costs by ${persons} people** if applicable.
      5. **Weather Considerations:** If an activity is weather-dependent, provide a **backup indoor option**.
      6. **Hidden Gems & Offbeat Spots:** Mix popular sites with **unique and lesser-known** experiences.
      7. **Travel Tips:** Provide helpful travel hacks, safety advice, or best times to visit.

      **STRICTLY RETURN JSON FORMAT ONLY. DO NOT INCLUDE EXTRA TEXT OR EXPLANATIONS.**

      JSON format:
      {
        "trip_overview": {
          "destination": "${destination}",
          "duration": "${days} days",
          "travelers": "${persons} person(s)",
          "total_budget": "₹${totalBudget}",
          "special_interests": "${interestText}"
        },
        "itinerary": [
          {
            "day": 1,
            "morning": {
              "activities": "Visit example place",
              "food": "Example restaurant (₹500 per person)",
              "transport": "Example transport",
              "cost": "₹500"
            },
            "afternoon": {
              "activities": "Visit example place",
              "food": "Example restaurant (₹600 per person)",
              "transport": "Example transport",
              "cost": "₹600"
            },
            "evening": {
              "activities": "Visit example place",
              "food": "Example restaurant (₹700 per person)",
              "transport": "Example transport",
              "cost": "₹700"
            },
            "budget_breakdown": "₹1,800",
            "tips": "Example tip"
          }
        ]
      }
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
        temperature: 0.85,
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from AI API");
    }

    console.log("🛠️ Raw AI Response:", data.choices[0].message.content);

    const responseText = data.choices[0].message.content;

    // Extract JSON safely
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response is not valid JSON");

    // Clean up and ensure valid JSON
    const cleanedJson = jsonMatch[0]
      .replace(/```json|```/g, "")  // Remove Markdown code block indicators
      .trim();

    try {
      const itineraryJSON = JSON.parse(cleanedJson);
      console.log("🗺️ AI-Generated JSON Itinerary:\n", JSON.stringify(itineraryJSON, null, 2));
      return itineraryJSON;
    } catch (jsonError) {
      console.error("❌ Error parsing AI response JSON:", jsonError);
      console.error("Raw AI Response:", responseText);
      throw new Error("Failed to parse AI-generated JSON");
    }
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    throw error;
  }
}
