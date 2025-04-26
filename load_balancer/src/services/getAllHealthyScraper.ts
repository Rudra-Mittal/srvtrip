import { fetchScrapperStatus } from "./fetchStatus";

// return all healthy servers in sorted order
export async function getAllHealthyScrapers(){
    try{
        const statuses = await fetchScrapperStatus();
        // console.log("Statuses:", statuses);
        
        const healthyServers = statuses.filter((server) => 
            server.queueLength < Infinity && server.activeTasks < Infinity
        );
        
        if(healthyServers.length === 0){
            console.log("No healthy servers available");
            return [];
        }
        
        // Sort all healthy servers from best to worst
        const sortedServers = healthyServers.sort((a, b) => {
            if(a.queueLength != b.queueLength){
                return a.queueLength - b.queueLength;
            }
            return a.activeTasks - b.activeTasks;
        });

        console.log("Sorted healthy servers:", sortedServers);
        return sortedServers.map(server => server.url);
    } catch(err){
        console.error("Error getting healthy scrapers:", err);
        return [];
    }
}
