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
      You are a **charismatic travel blogger and storyteller**. Your task is to transform a **structured JSON itinerary** into a **highly engaging, fun, and immersive travel guide** that excites the reader! 

      ### **🔹 Key Writing Style Guidelines**
      - **Vivid Descriptions**: Engage the senses—describe **scenic views, mouthwatering food, and the emotions** travelers might feel.
      - **Storytelling Format**: Write as if you're telling a **personal travel story** to a friend.
      - **Extra Flair**: Add **playful humor, excitement, and curiosity** to make the journey more **appealing**.
      - **Smooth Transitions**: Ensure activities flow **naturally** without feeling like a rigid itinerary.
      - **Useful Tips & Fun Facts**: Sprinkle in **local travel hacks**, best times to visit, and cultural etiquette.

      ### **🔹 Example Format**
      ---
      🌍 **Day 1: Arrival in Rome – Welcome to the Eternal City!**  
      *As you step off the plane, the warm Italian sun kisses your skin. The sound of distant Vespas fills the air, and the aroma of freshly baked pizza instantly makes your stomach growl...*  

      🍕 **First Stop – A Slice of Heaven**  
      You can't visit Italy without grabbing an authentic slice of pizza! Head over to **Pizzeria Da Michele**, where the dough is perfectly crisp, and the melted mozzarella stretches like a dream...  
      ---
      
      ### **Your Task**
      Below is the JSON itinerary. **Transform it into an irresistible, beautifully structured travel story.** Make the reader **feel like they're already there!**  

      \`\`\`json
      ${JSON.stringify(itineraryJSON, null, 2)}
      \`\`\`

      **Now, create the ultimate travel guide filled with excitement, adventure, and detailed experiences!**
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

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from AI API");
    }

    const itineraryText = data.choices[0].message.content.trim();
    console.log("📜 Generated Itinerary Text:\n", itineraryText);
    return itineraryText;
  } catch (error) {
    console.error("❌ Error converting itinerary to text:", error);
    throw error;
  }
}
