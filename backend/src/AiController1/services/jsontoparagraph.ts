import "dotenv/config";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "mixtral-8x7b-32768"; // Alternative: "llama3-70b-8192"

/**
 * Converts a structured JSON itinerary into an **immersive, exciting, and fun** travel guide.
 * @param itineraryJSON The JSON itinerary object.
 * @returns A **highly appealing, narrative-style** itinerary text.
 */
export async function convertItineraryToText(itineraryJSON: any) {
  try {
    if (!GROQ_API_KEY) throw new Error("Missing GROQ API Key!");

    const prompt = `
      You are a **vibrant travel blogger and storyteller** known for crafting **immersive, engaging, and fun** travel narratives.  
      Your task is to transform the provided **structured JSON itinerary** into a **beautifully narrated, exciting travel guide** that makes the reader feel like they're already experiencing the journey!

      ---
      🔥 **Your Writing Style Should Be:**  
      - **Vivid & Sensory**: Describe **scenic views, rich flavors, local sounds, and cultural vibes** in detail.  
      - **Personal & Engaging**: Write as if sharing **an unforgettable adventure** with a close friend.  
      - **Playful & Exciting**: Use a **lively tone**, inject **humor**, and build **anticipation** for upcoming experiences.  
      - **Smooth & Natural**: Avoid rigid scheduling; make everything flow **organically** like a real-life journey.  
      - **Packed with Insights**: Sprinkle in **local secrets, cultural etiquette, and expert travel tips**.  

      ---
      ✈️ **Example Format – How Each Day Should Be Structured**  

      ## 🌍 **Welcome to Paris – The City of Love!**  
      *The moment you step onto the cobbled streets of Paris, there's a magic in the air. The scent of freshly baked croissants drifts from a nearby café, and the Eiffel Tower peeks through the morning mist like a postcard coming to life...*  

      ---  
      ### 🏰 **Day 1: Exploring Paris in Style**  

      ☀️ **Morning – A French Breakfast & Eiffel Tower Views**  
      Start your morning with a **heavenly croissant and espresso** at **Café de Flore**. The flaky, buttery texture is an absolute delight! After breakfast, stroll towards the **Eiffel Tower**, where the golden morning light paints the city in breathtaking hues.  

      ---  
      🌆 **Afternoon – Strolling the Champs-Élysées & Louvre Adventure**  
      The **Champs-Élysées** awaits! Take a leisurely walk past luxury boutiques and charming cafés before heading to the **Louvre Museum**. Be sure to **skip the line** with an advance ticket and witness the Mona Lisa’s enigmatic smile up close.  

      ---  
      🌙 **Evening – Seine River Cruise & Iconic French Cuisine**  
      As the sun sets, hop on a **Seine River cruise** to see Paris illuminated at night. Cap off your day with an exquisite **French dinner at Le Procope**, where Napoleon once dined.  

      ---  
      🎒 **Pro Tip:** Buy a **Paris Pass** for unlimited public transport and priority access to museums.  
      
      💰 **Budget:** Pulled from the itinerary JSON dynamically.  

      ---  
      
      ## 🏖️ **Day 2: A Day Trip to the Stunning Versailles Palace**  
      
      ☀️ **Morning – Exploring the Extravagant Palace of Versailles**  
      Step into the grandeur of **Versailles Palace**, where **golden chandeliers, ornate halls, and lavish gardens** transport you to a time of French royalty.  

      ---  
      🌆 **Afternoon – Picnic by the Grand Canal**  
      Grab a **fresh baguette, cheese, and wine** from a local market and enjoy a peaceful **picnic by the Grand Canal** in the Versailles gardens.  

      ---  
      🌙 **Evening – Back to Paris & Montmartre Night Stroll**  
      Return to Paris and head to **Montmartre**, where street artists, cozy bistros, and the **Sacre-Cœur Basilica** create an enchanting atmosphere to end your day.  

      ---  
      🎒 **Pro Tip:** Arrive **early** to avoid crowds, and wear comfortable shoes for the vast gardens!  

      💰 **Budget:** Pulled from the itinerary JSON dynamically.  

      ---  

      Now, let’s bring your itinerary to life!  

      \`\`\`json
      ${JSON.stringify(itineraryJSON, null, 2)}
      \`\`\`

      ✍️ **Your Mission:**  
      Transform the above itinerary into a **captivating, immersive travel story** following the structured format above.  
      **Each day must include:**  
      - A **morning adventure**  
      - An **afternoon experience**  
      - An **evening highlight**  
      - A **Pro Tip & Budget section** at the **end** of each day.  
      - The **budget should be extracted from the JSON itinerary**.  

      **Make it feel like a dream journey waiting to happen!**  
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
        temperature: 0.85, // More creativity!
      }),
    });

    const data = await response.json() as any;
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from AI API");
    }

    const itineraryText = data.choices[0].message.content.trim();
    // console.log("📜 Generated Itinerary Text:\n", itineraryText);
    return itineraryText;
  } catch (error) {
    console.error("❌ Error converting itinerary to text:", error);
    throw error;
  }
}
