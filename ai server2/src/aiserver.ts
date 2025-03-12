import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY as string;

if (!GROQ_API_KEY) {
    console.error("Error: GROQ_API_KEY is missing. Check your .env file.");
    process.exit(1);
}

// ✅ Function to Read Reviews from `scraped_reviews.json`
const getReviewsFromFile = (placeName: string): string[] => {
    try {
        const filePath = path.join(__dirname, "scraped_reviews.json");
        console.log(`Reading reviews from: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.error("❌ Error: scraped_reviews.json not found.");
            return [];
        }

        const rawData = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(rawData);

        console.log(`Available Places: ${data.map((entry: any) => entry.place)}`); // Debugging

        const placeEntry = data.find((entry: any) => entry.place === placeName);
        if (placeEntry) {
            console.log(`✅ Reviews found for ${placeName}`);
            return placeEntry.reviews;
        } else {
            console.warn(`⚠️ No reviews found for ${placeName}`);
            return [];
        }
    } catch (error) {
        console.error("❌ Error reading reviews file:", error);
        return [];
    }
};

// ✅ Function to Summarize Reviews
const summarizeReviews = async (placeName: string): Promise<string> => {
    const reviews = getReviewsFromFile(placeName);

    if (!reviews || reviews.length === 0) {
        return `No reviews found for ${placeName}.`;
    }

    const systemPrompt = "You are an AI assistant that summarizes reviews for places...";
    const userPrompt = `Reviews for ${placeName}: ${reviews.join(" ")}\nProvide a summary:`;

    try {
        const response = await axios.post<{ choices: { message: { content: string } }[] }>(
            GROQ_API_URL,
            {
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0]?.message?.content || "No summary available.";
    } catch (error: any) {
        console.error("Axios error:", error);
        return `Error generating summary: ${error.message}`;
    }
};

// ✅ API Route to Get Summary from File
app.post("/get_summary", async (req: any, res: any) => {
    try {
        const { place } = req.body;

        if (!place) {
            return res.status(400).json({ error: "Missing place name" });
        }

        const summary = await summarizeReviews(place);
        res.json({ place, summary });

    } catch (error: any) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
