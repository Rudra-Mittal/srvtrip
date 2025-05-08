import { BACKEND_URL } from "../Backendurl/backendurl";
import { insertData } from "../controllers/insertReview";
import { scrapeGoogleMapsReviews } from "../controllers/reviewsScrapper";
import summarizeReview from "../controllers/summarizeReview";
import { ScrapingTask } from "../types/types";
import dotenv from 'dotenv';
dotenv.config();

// Configure the load balancer URL
const LOAD_BALANCER_URL = process.env.LOAD_BALANCER_URL || 'http://localhost:9000';

// Function to report results back to load balancer
async function reportToLoadBalancer(
    requestId: string | undefined, 
    success: boolean, 
    taskDetails?: any, 
    error?: any
) {
    if (!requestId) return; // Skip if no requestId

    try {
        console.log(`Reporting ${success ? 'success' : 'failure'} to load balancer for request: ${requestId}`);
        
        const response = await fetch(`${LOAD_BALANCER_URL}/scraper-result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requestId,
                success,
                data: success ? { message: 'Scraping completed successfully' } : null,
                error: error ? String(error) : null,
                taskDetails: !success ? taskDetails : null // Only send task details on failure
            })
        });
        
        if (!response.ok) {
            console.error(`Failed to report to load balancer: ${response.status} ${response.statusText}`);
        } else {
            console.log(`Successfully reported to load balancer for request: ${requestId}`);
        }
    } catch (err) {
        console.error(`Error reporting to load balancer:`, err);
    }
}

class ScrapingQueue {
    private queue: ScrapingTask[] = [];
    private limit: number = 3;
    private inProgress: number = 0;
    
    enqueue(task: ScrapingTask): void {
        this.queue.push(task);
        this.processNext();
    }
    
    private dequeue(): ScrapingTask | undefined {
        return this.queue.shift();
    }
    
    getQueueLength():number{
        return this.queue.length;
    }
    
    getActiveTasks():number{
        return this.inProgress;
    }
    
    private async processNext(): Promise<void> {
        if (this.queue.length === 0) return;
        if(this.inProgress>=this.limit) return;
        
        const task = this.dequeue();
        if (!task) {
            return;
        }
        
        this.inProgress++;
        
        try {
            console.log("Processing task:", task);
            const review = await scrapeGoogleMapsReviews(task.placeName, task.maxScrolls);
            
            if (review.reviews.length > 0) {
                await insertData({...review, placeId: task.placeId});
                const summarizedReview = await summarizeReview(task.placeId);
                
                fetch(BACKEND_URL + '/api/summarize', {
                    method: 'POST',
                    body: JSON.stringify({review: summarizedReview, placeId: task.placeId}),
                    headers: {
                        'Content-Type': 'application/json',
                        'server-api-key': `${process.env.SERVER_API_KEY}`
                    }
                }).catch((err)=>{
                    console.log("Error in sending request",err)
                });
                
                console.log("Sent request to DB");
                
                // Report success to load balancer if requestId exists
                if (task.requestId) {
                    reportToLoadBalancer(task.requestId, true);
                }
            } else {
                if(task.iteration == 1){
                    console.log("No reviews found, retrying... ");
                    this.queue.push({
                        ...task, 
                        placeName: task.placeName+' ,'+task.placeAddress, 
                        iteration: 2
                    });
                } else {
                    console.log("No reviews found in second iteration");
                    // Report failure to load balancer after all retries
                    if (task.requestId) {
                        reportToLoadBalancer(
                            task.requestId, 
                            false, 
                            { placeId: task.placeId, placeName: task.placeName, maxScrolls: task.maxScrolls, placeAddress: task.placeAddress },
                            "No reviews found after retries"
                        );
                    }
                }
            }
        } catch (error) {
            console.log("Error in scraping:", error);
            
            // Report failure to load balancer
            if (task.requestId) {
                reportToLoadBalancer(
                    task.requestId, 
                    false,
                    { placeId: task.placeId, placeName: task.placeName, maxScrolls: task.maxScrolls, placeAddress: task.placeAddress },
                    error
                );
            }
        } finally {
            this.inProgress--;
            this.processNext();
        }
    }
}

export const scrapingQueue = new ScrapingQueue();