import { insertData } from "./controllers/insertReview";
import express from "express";
import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";
import { searchQuery } from "./controllers/getSimilar";
import dotenv from 'dotenv';
import { migrateData } from "./controllers/migrate";
import { updateEnv } from "./utils/updateEnv";
import summarizeReview from "./controllers/summarizeReview";
// import { saveReview } from "./utils/saveReview";
dotenv.config();
const app= express();
app.use(express.json())
interface ScrapingTask {
    placeId: string,
    placeName: string;
    maxScrolls: number;
    placeAddress:string,
    iteration:number 
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
                        'Content-Type': 'application/json'
                    }
                }).catch((err)=>{
                    console.log("Error in sending request",err
                        
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

const scrapingQueue = new ScrapingQueue();
const BACKEND_URL=process.env.BACKEND_URL as string
// auth middleware pending
app.post('/scraper',async (req,res)=>{
    const {placeName,maxScrolls,placeId,placeAddress}=req.body;
    scrapingQueue.enqueue({placeId,placeName,maxScrolls,placeAddress,iteration:1})
    res.status(200).json({"message":"Sent request successfully"})
    return ;
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
app.post('/query',(req,res)=>{
    const {query,placeName,limit}=req.body;
    searchQuery(query,placeName,limit)
    .then((result)=>{
        res.send(result)
    })  
    .catch((err)=>{
        console.log(err)
        res.json({"error":"Server err"})
    })
})

app.post('/migrate',async (req,res)=>{
    const {serverPassword,WEAVIATE_URL,WEAVIATE_API_KEY}=req.body;
    
    if(serverPassword!=process.env.MIGRATE_PASSWORD){
        res.status(401).json({"error":"Invalid password"})
        return
    }
    migrateData(WEAVIATE_URL,WEAVIATE_API_KEY)
    .then((result:any)=>{
            updateEnv(WEAVIATE_URL,WEAVIATE_API_KEY)
            res.json(result)
            return 
        }
    )
    .catch((err:any)=>{
        console.log(err)
        res.json({"error":"Server err"}).status(500)
        return ;
    }
)
})
