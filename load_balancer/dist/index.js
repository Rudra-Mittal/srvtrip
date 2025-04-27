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
const trySendingRequests_1 = require("./services/trySendingRequests");
const getAllHealthyScraper_1 = require("./services/getAllHealthyScraper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/loadbalancer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all healthy scrapers in order from best to worst
    const healthyScrapers = yield (0, getAllHealthyScraper_1.getAllHealthyScrapers)();
    if (healthyScrapers.length === 0) {
        res.status(503).json({ "error": "No healthy scraper servers available" });
        return;
    }
    // Try each server in order until one succeeds or we run out of servers
    for (let i = 0; i < healthyScrapers.length; i++) {
        const currentScraper = healthyScrapers[i];
        console.log(`Attempt ${i + 1}/${healthyScrapers.length}: Trying scraper ${currentScraper}`);
        const result = yield (0, trySendingRequests_1.trySendingRequest)(currentScraper, req.body);
        if (result.success) {
            console.log(`Successfully processed by scraper: ${currentScraper}`);
            res.status(200).json(result.data);
            return;
        }
        console.log(`Scraper ${currentScraper} failed. ${i < healthyScrapers.length - 1 ? 'Trying next server.' : 'No more servers to try.'}`);
    }
    // If we get here, all servers failed
    res.status(503).json({ "error": "All available scraper servers failed to process the request" });
}));
const places = [
    "Taj Mahal", "Red Fort", "India Gate", "Qutub Minar", "Gateway of India",
    "Charminar", "Hawa Mahal", "Amber Fort", "Mysore Palace", "Victoria Memorial"
];
function fireRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < places.length; i++) {
            const body = {
                placeName: places[i],
                maxScrolls: 5,
                placeId: `${i + 1}`,
                placeAddress: "India"
            };
            try {
                const res = yield fetch('http://localhost:9000/loadbalancer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = yield res.json();
                console.log(`✅ Sent place: ${places[i]} | Response:`, data);
            }
            catch (err) {
                console.error(`❌ Error sending place: ${places[i]}`, err);
            }
        }
    });
}
fireRequests();
const PORT = 9000;
app.listen(PORT, () => {
    console.log("Load Balancer Server is running on port 9000");
});
