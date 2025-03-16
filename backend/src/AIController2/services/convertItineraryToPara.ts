import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const convertItineraryToPara = async (itinerary:any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const itineraryString = JSON.stringify(itinerary, null, 2); // Properly formatted JSON string

    const prompt =`
    You are an AI that converts a detailed travel itinerary in JSON format to a paragraph-based itinerary.
    Convert the following JSON-formatted itinerary into a well-structured, detailed paragraph format while maintaining the day-wise breakdown. Each day should be described in a natural, travel-friendly manner, covering all aspects of the trip, including activities, food, transportation, and budget.

    **Formatting Instructions:**
    1. **Use "Day X" as the main heading** (bold and properly spaced).
    2. **Use "Morning", "Afternoon", and "Evening" as subheadings** to separate the day's events.
    3. **Merge details into an engaging paragraph format** rather than listing them.
    4. **Include details on activities, food, transport, and budget naturally** in the flow.
    5. **Keep travel tips at the end of each day's description.**
    6. **At the end of the itinerary, include a "Total Budget Summary" with total expenses and remaining budget.**
    7. **Ensure readability by adding proper spacing between sections.**

    ---

    **Example Conversion Format:**  
    **Day 1:**  
    The journey begins with arrival at **Devi Ahilyabai Holkar Airport in Indore**. A pre-booked taxi ensures a smooth transfer to Ujjain, taking approximately an hour. After checking into **Hotel Anjushree (₹4000/night)**, travelers can freshen up before heading out for the day's adventures. Breakfast is enjoyed at **Indore Airport (₹300 per person)**.

    **Morning:**  
    The morning starts with a visit to the **Mahakaleshwar Temple**, where a priority pass is booked in advance for a smooth darshan experience. Visitors immerse themselves in the spiritual aura before heading for lunch.

    **Afternoon:**  
    A traditional **Gujarati Thali at Damodar Restaurant (₹400 per person)** provides a hearty meal. Exploring the temple premises and nearby markets follows. An **auto-rickshaw (₹300)** ensures hassle-free transportation.

    **Evening:**  
    As evening approaches, the mesmerizing **Bhasma Aarti at Mahakaleshwar Temple** is a must-see (₹200 per person, prior booking required). Visitors can stroll through the **local market**, enjoying cultural souvenirs. Dinner at **Hariyali Restaurant (₹600 per person)** offers a delightful experience before heading back to the hotel.

    **Budget Summary for the Day:** ₹8800  
    **Pro Tips:**  
    - **Book the Bhasma Aarti and priority darshan passes in advance.**  
    - **Dress modestly for temple visits.**  
    - **Be mindful of pickpockets in crowded areas.**  

    ---

    **Total Budget Summary:**  
    - **Total trip cost:** ₹{total_expense}  
    - **Budget remaining:** ₹{budget - total_expense}  

    Now, using this format, convert the given JSON itinerary into a well-structured, readable travel itinerary.  
    **Here is the JSON itinerary:**  

    ${itineraryString}

        `;

    const response = await model.generateContent(prompt);
    const result = response.response;
    const text = result.text().trim();

    return text;

  } catch (error) {
    console.error("Error converting itinerary in json format to para:", error);
    return { success: false, message: "Failed to convert itinerary in json format to para" };
  }
};