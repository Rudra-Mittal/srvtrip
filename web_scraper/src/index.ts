import { insertData } from "./controllers/insertReview";
import express from "express";
import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";
import { searchQuery } from "./controllers/getSimilar";
import dotenv from 'dotenv';
import { migrateData } from "./controllers/migrate";
import { updateEnv } from "./utils/updateEnv";
import summarizeReview from "./controllers/summarizeReview";
dotenv.config();
const app= express();
app.use(express.json())


// auth middleware pending
app.post('/scraper',async (req,res)=>{
    const {placeName,maxScrolls,placeId}=req.body;
    const review=await scrapeGoogleMapsReviews(placeName,maxScrolls);
    console.log(review)
    const query=`You are an advanced AI trained to summarize user reviews with precision. 
        Your task is to create a **120-word summary** strictly based **only on the given reviews**.
        
        **Rules:**
        - Do **NOT** add any extra details or assumptions.
        - The summary **must only include information found in the provided reviews**.
        - Identify recurring themes, both positive and negative.
        - Do **not** include generic opinions or external knowledge.
        - Ensure the summary is **cohesive, engaging, and maintains a fluent structure**`;
        
    if(review.reviews.length>0) insertData({...review,placeId}).then(()=>{
        summarizeReview(query,placeId);
    })
    
    res.send(review)
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
