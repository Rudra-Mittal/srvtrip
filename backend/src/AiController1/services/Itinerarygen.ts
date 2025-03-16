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
      1. **Accurate Locations:** Every location (**attraction, restaurant, hotel, etc.**) **must exist on Google Maps** with **its full address or a recognizable landmark**.
      2. **Use a Unique Symbol:** Always enclose locations inside **🗺[[ ]** to clearly differentiate them.  
         **Example:** 🗺[[Har Ki Pauri, Near Ganges Ghat, Haridwar, Uttarakhand, India]
      3. **Daily Plan Structure:** Each day must have **morning, afternoon, and evening** activities.
      4. **Local Food & Culture:** Include **authentic experiences** such as local cuisine, street food, or cultural events.
      5. **Budget Breakdown:** Provide the cost per activity, food, and transport. **Multiply costs by ${persons} people** if applicable.
      6. **Weather Considerations:** If an activity is weather-dependent, provide a **backup indoor option**.
      7. **Hidden Gems & Offbeat Spots:** Mix popular sites with **unique and lesser-known** experiences.
      8. **Travel Tips:** Provide helpful travel hacks, safety advice, or best times to visit.
      
      ### **🚀 JSON Response Format (Strict)**
      \`\`\`json
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
              "activities": "Arrive in 🗺[[Shimla Airport (Jubberhatti), Shimla, Himachal Pradesh, India], check into 🗺[[Hotel Combermere, The Mall, Shimla], and explore 🗺[[Mall Road, Shimla, Himachal Pradesh, India].",
              "food": "Breakfast at 🗺[[Indian Coffee House, The Mall, Shimla, Himachal Pradesh, India] (₹250 per person).",
              "transport": "Taxi from 🗺[[Shimla Airport (Jubberhatti), Shimla, Himachal Pradesh , India] to hotel (₹800 total).",
              "cost": "₹1,050"
            },
            "afternoon": {
              "activities": "Visit 🗺[[The Ridge, The Mall Road, Shimla] and 🗺[[Christ Church, The Mall, Shimla] for scenic views.",
              "food": "Lunch at 🗺[[Wake & Bake Café, 34 Mall Road, Shimla] (₹600 per person).",
              "transport": "Walking tour.",
              "cost": "₹600"
            },
            "evening": {
              "activities": "Dinner at 🗺[[8INE Rooftop Restaurant, The Mall, Shimla], offering a beautiful mountain view.",
              "food": "North Indian & Chinese cuisine (₹800 per person).",
              "transport": "Auto-rickshaw to 🗺[[8INE Rooftop Restaurant, The Mall, Shimla] (₹150).",
              "cost": "₹950"
            },
            "budget_breakdown": "₹3,100",
            "tips": "Best to explore 🗺[[Mall Road, Shimla] in the evening for a lively atmosphere."
          }
        ]
      }
      \`\`\`

      ### **🚦 Response Instructions:**
      - The response **must be valid JSON** with **no extra text, explanations, or formatting**.
      - Do **not** include phrases like “Here’s your itinerary” or “I hope this helps.”
      - The JSON **must start with { and end with }**.
      - Ensure the itinerary includes:
        - **Morning, Afternoon, and Evening activities**
        - **Accurate places (must exist on Google Maps)**
        - **Food recommendations with restaurant names & prices**
        - **Transport details**
        - **Total daily cost breakdown**
        - **Local travel tips**
      - **Multiply costs by ${persons} people** where necessary.

      **Strictly return valid JSON with no extra text.**
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

    const data = await response.json() as any;
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from AI API");
    }

    console.log("🛠️ Raw AI Response:", data.choices[0].message.content);

    const rawContent = data.choices[0].message.content.trim();

    // Extract JSON content from the AI response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response is not valid JSON");

    let cleanedText = jsonMatch[0]
      .replace(/```json|```/g, "") // Remove Markdown code block indicators
      .replace(/\r?\n/g, " ") // Remove newlines
      .replace(/\t/g, " ") // Remove tabs
      .replace(/\\"/g, '"') // Fix incorrect escaped quotes
      .replace(/\\n/g, " ") // Replace `\n` with space
      .replace(/\\t/g, " ") // Replace `\t` with space
      .trim();

    cleanedText = cleanedText.replace(/\\(?=["\/bfnrt])/g, ""); // Fix bad escape sequences

    try {
      const itineraryJSON = JSON.parse(cleanedText);
      return itineraryJSON;
    } catch (parseError) {
      console.error("❌ Error parsing cleaned JSON:", cleanedText);
      throw new Error("JSON Parsing Error: " + String(parseError));
    }
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    throw error;
  }
}
