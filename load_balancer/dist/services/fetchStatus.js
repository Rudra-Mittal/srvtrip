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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchScrapperStatus = fetchScrapperStatus;
const scraperUrls_1 = require("../config/scraperUrls");
function fetchScrapperStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const statuses = yield Promise.all(scraperUrls_1.scraperServers.map((scraper) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Add timeout to prevent hanging requests
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
                const response = yield fetch(scraper.url + "status", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                // console.log("Response from scraper:", data);
                console.log("Queue length:", data.queueLength);
                console.log("Active tasks:", data.activeTasks);
                return {
                    id: scraper.id,
                    url: scraper.url,
                    queueLength: data.queueLength,
                    activeTasks: data.activeTasks,
                };
            }
            catch (err) {
                console.error(`Error fetching status from ${scraper.url}:`, err);
                //if scraper server is down, set the queue length and active tasks to infinity to denote unhealthy server.
                return {
                    id: scraper.id,
                    url: scraper.url,
                    queueLength: Infinity,
                    activeTasks: Infinity,
                };
            }
        })));
        return statuses;
    });
}
