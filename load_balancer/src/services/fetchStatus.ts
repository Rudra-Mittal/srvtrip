import { scraperServers } from "../config/scraperUrls";

export async function fetchScrapperStatus(){
    const statuses=await Promise.all(scraperServers.map(async(scraper)=>{
        try{
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(scraper.url+"status",{
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
            const data = await response.json();

            // console.log("Response from scraper:", data);
            console.log("Queue length:", data.queueLength);
            console.log("Active tasks:", data.activeTasks);

            return{
                id:scraper.id,
                url:scraper.url,
                queueLength: data.queueLength,
                activeTasks: data.activeTasks,
            };

        }catch(err){
            console.error(`Error fetching status from ${scraper.url}:`, err);
            //if scraper server is down, set the queue length and active tasks to infinity to denote unhealthy server.
            return {
                id:scraper.id,
                url:scraper.url,
                queueLength:Infinity,
                activeTasks:Infinity,
            };
        }
    }));
    return statuses;
}