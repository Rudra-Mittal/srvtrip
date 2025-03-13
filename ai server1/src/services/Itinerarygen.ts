import "dotenv/config";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "mixtral-8x7b-32768"; // Alternative: "llama3-70b-8192"

export async function generateItinerary(
  destination: string,
  days: number,
  totalBudget: number,
  persons: number,
  interests?: string[],
) {
  try {
    if (!GROQ_API_KEY) throw new Error("Missing GROQ API Key!");

    const interestText = interests && interests.length > 0 
      ? `Prioritize activities related to the following interests: **${interests.join(", ")}**. Ensure that at least **60%** of the itinerary aligns with these interests.`
      : "Provide a well-balanced itinerary covering **sightseeing, culture, food, and leisure**.";

    const prompt = `
    📌 **Generate a detailed, exciting, and immersive travel itinerary** for a trip to **${destination}** spanning **${days} days**.
    - The trip is planned for **${persons} people** with a total budget of **₹${totalBudget}**.
    - Ensure the budget covers **food, transport, sightseeing, activities, and miscellaneous expenses**.
    - Optimize **travel routes** to minimize unnecessary travel time and maximize experience.
    - If an activity is **seasonal or weather-dependent**, mention it in **tips**.

    🔹 **User Interests:**  
    ${interestText}

    ---  

    🏝️ **Daily Itinerary Format**  
    Each day must be **structured in morning, afternoon, and evening**, with **rich details** on:
    - **Activities** → Provide a detailed description, unique experiences, and any historical or cultural insights.
    - **Food** → Recommend **authentic local dishes** with restaurant names and pricing.
    - **Transport** → Include best travel modes with estimated costs.
    - **Budget Breakdown** → Ensure a clear **₹ cost estimate** for the day.
    - **Insider Tips & Fun Facts** → Add special **travel hacks, safety tips, and hidden gems**.

    ---  

    **🔹 Response Format (Strict JSON Only)**
    {
      "itinerary": [
        {
          "day": 1,
          "morning": {
            "activities": "🌅 **Sunrise at XYZ Viewpoint** – Watch the sky transform into a painting as the golden sun rises over the city. This spot is a local favorite for yoga enthusiasts and photographers.",
            "food": "🥞 **Breakfast at ABC Café** – Try the legendary **butter masala dosa**, freshly brewed filter coffee, and soft idlis with four types of chutney. (₹250 per person)",
            "transport": "🚖 Taxi from hotel to viewpoint (₹500 total)",
            "cost": "₹750"
          },
          "afternoon": {
            "activities": "🏰 **Explore the Majestic XYZ Palace** – Step into history with this **400-year-old royal residence**, filled with **intricate carvings, grand chandeliers, and secret underground tunnels**. Local guides share hidden stories of lost treasures.",
            "food": "🍛 **Lunch at The Royal Kitchen** – Savor a rich **Mughlai thali** featuring saffron-infused biryani, tender kebabs, and creamy korma. (₹700 per person)",
            "transport": "🚶 Walk through the bustling Old Bazaar streets, filled with spice vendors and handloom stalls.",
            "cost": "₹850"
          },
          "evening": {
            "activities": "🚢 **Sunset Boat Ride on the XYZ River** – Glide through the serene waters as the sun paints the sky in hues of pink and orange. The riverbanks are lined with **ancient temples and hidden caves**.",
            "food": "🍣 **Dinner at Sky Lounge** – Enjoy an **open-air rooftop dining experience** with breathtaking city views. Try their signature **grilled salmon with lemon butter sauce**. (₹900 per person)",
            "transport": "🚕 Auto-rickshaw to the riverside (₹200)",
            "cost": "₹1,100"
          },
          "budget_breakdown": "₹2,700",
          "tips": [
            "🔹 **Hidden Gem Alert!** Visit the small café near XYZ Palace that serves handmade rose-flavored kulfi – a local delicacy!",
            "🔹 **Best Time to Visit:** Arrive at the palace before 10 AM to avoid long queues.",
            "🔹 **Bargaining Tip:** At Old Bazaar, start at **50% of the quoted price** when buying souvenirs."
          ]
        }
      ]
    }

    ---  

    **🔹 Strict Response Instructions:**  
    - **Return only JSON** (no extra explanations or markdown formatting).  
    - Ensure **realistic budget allocation** that aligns with the total budget.  
    - Multiply **cost estimates by ${persons} people** where applicable.  
    - Enhance storytelling to make the itinerary **exciting and immersive**.  
    - Use **fun facts, hidden gems, and expert travel tips** to enrich the experience.  

    🎯 **Now, generate an unforgettable itinerary!** 🚀
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

    // Debugging: Log raw AI response
    console.log("🛠️ Raw AI Response:", data.choices[0].message.content);

    // Extract only JSON from the response
    const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response is not valid JSON");

    const itineraryJSON = JSON.parse(jsonMatch[0]);
    console.log("🗺️ AI-Generated JSON Itinerary:\n", JSON.stringify(itineraryJSON, null, 2));

    return itineraryJSON;
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    throw error;
  }
}
