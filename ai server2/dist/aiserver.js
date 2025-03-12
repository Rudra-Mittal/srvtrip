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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
    console.error("Error: GROQ_API_KEY is missing. Check your .env file.");
    process.exit(1);
}
// ✅ Function to Read Reviews from `scraped_reviews.json`
const getReviewsFromFile = (placeName) => {
    try {
        const filePath = path_1.default.join(__dirname, "scraped_reviews.json");
        console.log(`Reading reviews from: ${filePath}`);
        if (!fs_1.default.existsSync(filePath)) {
            console.error("❌ Error: scraped_reviews.json not found.");
            return [];
        }
        const rawData = fs_1.default.readFileSync(filePath, "utf-8");
        const data = JSON.parse(rawData);
        console.log(`Available Places: ${data.map((entry) => entry.place)}`); // Debugging
        const placeEntry = data.find((entry) => entry.place === placeName);
        if (placeEntry) {
            console.log(`✅ Reviews found for ${placeName}`);
            return placeEntry.reviews;
        }
        else {
            console.warn(`⚠️ No reviews found for ${placeName}`);
            return [];
        }
    }
    catch (error) {
        console.error("❌ Error reading reviews file:", error);
        return [];
    }
};
// ✅ Function to Summarize Reviews
const summarizeReviews = (placeName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const reviews = getReviewsFromFile(placeName);
    if (!reviews || reviews.length === 0) {
        return `No reviews found for ${placeName}.`;
    }
    const systemPrompt = "You are an AI assistant that summarizes reviews for places...";
    const userPrompt = `Reviews for ${placeName}: ${reviews.join(" ")}\nProvide a summary:`;
    try {
        const response = yield axios_1.default.post(GROQ_API_URL, {
            model: "mixtral-8x7b-32768",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        return ((_b = (_a = response.data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "No summary available.";
    }
    catch (error) {
        console.error("Axios error:", error);
        return `Error generating summary: ${error.message}`;
    }
});
// ✅ API Route to Get Summary from File
app.post("/get_summary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { place } = req.body;
        if (!place) {
            return res.status(400).json({ error: "Missing place name" });
        }
        const summary = yield summarizeReviews(place);
        res.json({ place, summary });
    }
    catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
}));
// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
