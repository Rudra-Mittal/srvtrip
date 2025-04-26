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
exports.trySendingRequest = trySendingRequest;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Function to try sending a request to a specific scraper
function trySendingRequest(scraperUrl, requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const { placeName, maxScrolls, placeId, placeAddress } = requestBody;
        try {
            console.log(`Trying scraper: ${scraperUrl}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            const response = yield fetch(`${scraperUrl}scraper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "server-api-key": `${process.env.SERVER_API_KEY}`
                },
                body: JSON.stringify({ placeName, maxScrolls, placeId, placeAddress }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            return {
                success: true,
                data: data
            };
        }
        catch (err) {
            console.error(`Error with scraper ${scraperUrl}:`, err);
            return {
                success: false,
                error: err
            };
        }
    });
}
