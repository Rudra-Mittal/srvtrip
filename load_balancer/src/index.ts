import express from 'express';
import { trySendingRequest } from './services/trySendingRequests';
import { getAllHealthyScrapers } from './services/getAllHealthyScraper';
const app=express();

app.use(express.json());

app.post("/loadbalancer", async(req, res) => {
    // Get all healthy scrapers in order from best to worst
    const healthyScrapers = await getAllHealthyScrapers();
    
    if(healthyScrapers.length === 0){
        res.status(503).json({ "error": "No healthy scraper servers available" });
        return;
    }
    
    // Try each server in order until one succeeds or we run out of servers
    for (let i = 0; i < healthyScrapers.length; i++) {
        const currentScraper = healthyScrapers[i];
        console.log(`Attempt ${i+1}/${healthyScrapers.length}: Trying scraper ${currentScraper}`);
        
        const result = await trySendingRequest(currentScraper, req.body);
        
        if (result.success) {
            console.log(`Successfully processed by scraper: ${currentScraper}`);
            res.status(200).json(result.data);
            return;
        }
        
        console.log(`Scraper ${currentScraper} failed. ${i < healthyScrapers.length - 1 ? 'Trying next server.' : 'No more servers to try.'}`);
    }
    
    // If we get here, all servers failed
    res.status(503).json({ "error": "All available scraper servers failed to process the request" });
});

//test by sending requests to the load balancer server by sending 10 places simultaneously
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

fireRequests();


const PORT=9000;    
app.listen(PORT,()=>{
    console.log("Load Balancer Server is running on port 9000");
})