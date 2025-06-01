import express from "express";
import { searchQuery } from "./controllers/getSimilar";
import dotenv from 'dotenv';
import { migrateData } from "./controllers/migrate";
import { updateEnv } from "./utils/updateEnv";
import { verifyServerApiKey } from "./middleware/serverAuthMiddleware";
import { scrapingQueue } from "./scrappingqueue/scrappingqueue";
// import { saveReview } from "./utils/saveReview";
dotenv.config();
const app= express();
app.use(express.json())

// auth middleware pending
app.post('/scraper',verifyServerApiKey, async (req,res)=>{
    console.log("Received request from loadbalancer");
    const {placeName, maxScrolls, placeId, placeAddress, requestId} = req.body;
    
    // Check if requestId is provided
    if (!requestId) {
        console.log("Request received without requestId, processing normally");
    } else {
        console.log(`Processing request with ID: ${requestId}`);
    }
    
    // Queue the task with all parameters including requestId
    scrapingQueue.enqueue({
        placeId, 
        placeName, 
        maxScrolls, 
        placeAddress, 
        iteration: 1,
        requestId // Pass the requestId to the queue
    });
    
    res.status(200).json({"message":"Sent request successfully"});
    return;
});

app.get("/status",async(req,res)=>{
    const queueLength=scrapingQueue.getQueueLength();
    const activeTasks=scrapingQueue.getActiveTasks();
    res.status(200).send({queueLength,activeTasks});
    return ;
});

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

// const PORT= process.env.PORT || 3001;

app.listen(3001,()=>{
    console.log(`Server is running on 3001`)
})
