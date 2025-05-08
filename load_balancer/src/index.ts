import express from 'express';
import { trySendingRequest } from './services/trySendingRequests';
import { getAllHealthyScrapers } from './services/getAllHealthyScraper';
const app = express();

// Simple in-memory storage to track pending requests
const pendingRequests = new Map();

app.use(express.json());

// Main load balancer endpoint - send to best scraper asynchronously
app.post("/loadbalancer", async(req:any, res:any) => {
    // Generate a unique request ID
    const requestId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
    
    // Get all healthy scrapers in order from best to worst
    const healthyScrapers = await getAllHealthyScrapers();
    
    if(healthyScrapers.length === 0){
        return res.status(503).json({ "error": "No healthy scraper servers available" });
    }
    
    // Take only the best scraper
    const bestScraper = healthyScrapers[0];
    console.log(`Selected best scraper: ${bestScraper}`);
    
    // Store the request data and available scrapers for potential retry
    pendingRequests.set(requestId, {
        requestData: req.body,
        scrapers: healthyScrapers,
        currentScraperIndex: 0,
        attempts: 1
    });
    
    // Send request to best scraper asynchronously (fire and forget)
    trySendingRequest(bestScraper, {
        ...req.body,
        requestId // Pass the request ID so scraper can include it when reporting back
    }).catch(err => {
        console.error("Error sending request to scraper:", err);
    });
    
    // Respond immediately to client
    res.status(202).json({ 
        message: "Request accepted and sent to best available scraper",
        requestId: requestId
    });
});

// New endpoint for scrapers to report success/failure
app.post("/scraper-result", async(req:any, res:any) => {
    const { requestId, success, data, error } = req.body;
    
    if (!requestId || pendingRequests.has(requestId) === false) {
        return res.status(400).json({ error: "Invalid or unknown requestId" });
    }
    
    const requestInfo = pendingRequests.get(requestId);
    
    if (success) {
        console.log(`Request ${requestId} completed successfully`);
        pendingRequests.delete(requestId);
        return res.status(200).json({ message: "Success acknowledged" });
    } else {
        // Handle failure - try next best scraper if available
        const nextScraperIndex = requestInfo.currentScraperIndex + 1;
        
        if (nextScraperIndex < requestInfo.scrapers.length) {
            const nextScraper = requestInfo.scrapers[nextScraperIndex];
            console.log(`Request ${requestId} failed. Retrying with next scraper: ${nextScraper}`);
            
            // Update request info
            requestInfo.currentScraperIndex = nextScraperIndex;
            requestInfo.attempts += 1;
            pendingRequests.set(requestId, requestInfo);
            
            // Send to next scraper asynchronously
            trySendingRequest(nextScraper, {
                ...requestInfo.requestData,
                requestId
            }).catch(err => {
                console.error("Error sending request to next scraper:", err);
            });
            
            return res.status(200).json({ message: "Failure acknowledged, retrying with next scraper" });
        } else {
            // All scrapers have been tried
            console.log(`Request ${requestId} failed on all available scrapers`);
            pendingRequests.delete(requestId);
            return res.status(200).json({ message: "Failure acknowledged, no more scrapers available" });
        }
    }
});

// For development/testing only
// In production, you would remove this test code
const places = [
    "Taj Mahal", "Red Fort", "India Gate", "Qutub Minar", "Gateway of India", 
    "Charminar", "Hawa Mahal", "Amber Fort", "Mysore Palace", "Victoria Memorial"
];

async function fireRequests() {
    for (let i = 0; i < places.length; i++) {
        const body = {
            placeName: places[i],
            maxScrolls: 5,
            placeId: `${i + 1}`,
            placeAddress: "India"
        };

        try {
            const res = await fetch('http://localhost:9000/loadbalancer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            console.log(`✅ Sent place: ${places[i]} | Response:`, data);
        } catch (err) {
            console.error(`❌ Error sending place: ${places[i]}`, err);
        }
    }
}

// Uncomment to test
// fireRequests();

const PORT = 9000;    
app.listen(PORT, () => {
    console.log("Load Balancer Server is running on port 9000");
});