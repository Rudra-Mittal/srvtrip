import { BACKEND_URL } from "../Backendurl/backendurl";
import { insertData } from "../controllers/insertReview";
import { scrapeGoogleMapsReviews } from "../controllers/reviewsScrapper";
import summarizeReview from "../controllers/summarizeReview";
import { ScrapingTask } from "../types/types";
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
    
    private async processNext(): Promise<void> {
        if (this.queue.length === 0) return;
        if(this.inProgress>=this.limit)return ;
        const task = this.dequeue();
        if (!task) {
            return;
        }
        this.inProgress++;
        try {
            console.log("Processing task:", task);
            const review = await scrapeGoogleMapsReviews(task.placeName, task.maxScrolls);
            this.inProgress--;
            this.processNext();
            console.log("Task completed:", task);
            if (review.reviews.length > 0) {
                await insertData({...review, placeId: task.placeId});
                const summarizedReview = await summarizeReview(task.placeId);
                
                fetch(BACKEND_URL + '/api/summarize', {
                    method: 'POST',
                    body: JSON.stringify({review: summarizedReview, placeId: task.placeId}),
                    headers: {
                        'Content-Type': 'application/json',
                        'server-api-key': `${process.env.SERVER_API_KEY}` // Add this header
                    }
                }).catch((err)=>{
                    console.log("Error in sending request",err)
                        
                });
                console.log("Sent request to DB");
            } else {
                if(task.iteration==1){
                    console.log("No reviews found, retrying... ");
                    this.queue.push({...task, placeName: task.placeName+' ,'+task.placeAddress , iteration:2})
                }else{
                    console.log("No reviews found in second iteration");
                }
            }
        } catch (error) {
            console.log("Error sever")
        }
    }
}

export const scrapingQueue = new ScrapingQueue();