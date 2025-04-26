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
exports.getAllHealthyScrapers = getAllHealthyScrapers;
const fetchStatus_1 = require("./fetchStatus");
// return all healthy servers in sorted order
function getAllHealthyScrapers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const statuses = yield (0, fetchStatus_1.fetchScrapperStatus)();
            // console.log("Statuses:", statuses);
            const healthyServers = statuses.filter((server) => server.queueLength < Infinity && server.activeTasks < Infinity);
            if (healthyServers.length === 0) {
                console.log("No healthy servers available");
                return [];
            }
            // Sort all healthy servers from best to worst
            const sortedServers = healthyServers.sort((a, b) => {
                if (a.queueLength != b.queueLength) {
                    return a.queueLength - b.queueLength;
                }
                return a.activeTasks - b.activeTasks;
            });
            console.log("Sorted healthy servers:", sortedServers);
            return sortedServers.map(server => server.url);
        }
        catch (err) {
            console.error("Error getting healthy scrapers:", err);
            return [];
        }
    });
}
