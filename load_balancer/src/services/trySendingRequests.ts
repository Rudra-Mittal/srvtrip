import dotenv from "dotenv";
dotenv.config();
// Function to try sending a request to a specific scraper
export async function trySendingRequest(scraperUrl: string, requestBody: any) {
    const { placeName, maxScrolls, placeId, placeAddress } = requestBody;
    
    try {
        console.log(`Trying scraper: ${scraperUrl}`);
        
        const controller = new AbortController();
        const timeoutId: NodeJS.Timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`${scraperUrl}/scraper`, {
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
        
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    } catch (err) {
        console.error(`Error with scraper ${scraperUrl}:`, err);
        return {
            success: false,
            error: err
        };
    }
}