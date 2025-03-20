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
    // const {placeName,maxScrolls,placeId}=req.body;
    // const review=await scrapeGoogleMapsReviews(placeName,maxScrolls);
    // console.log(review)
    const query = `You are an advanced AI trained to analyze and summarize user reviews with precision. 
                Your task is to generate a **concise (around 100-120 words) review summary** and a **final rating** based strictly on the provided reviews.

                **Instructions:**
                - Extract key points from the reviews, identifying common themes (both positive and negative).
                - Ensure the summary is **clear, engaging, and based only on the provided reviews**.
                - Assign a **final rating (out of 5)** by averaging the ratings from all reviews.
                - Do **NOT** include any assumptions, external knowledge, or generic opinions.
                - Return the result in **JSON format** with two fields: 
                - **summarizedReview**: A well-structured, precise summary of the reviews.
                - **finalRating**: The calculated overall rating from the reviews.`;
            const response=await summarizeReview(query,"ChIJaXD1f0yxbTkRvquNoSkESuk");
            //console.log(response);
            res.send(response);

        
    // if(review.reviews.length>0) {
    //     insertData({...review,placeId}).then(()=>{
    //         summarizeReview(query,placeId).then((summarizedReview)=>{
    //              res.json({summarizedReview,placeId})
    //              return
    //         })
    //     })
    // }else{
    //     res.status(404).json({message:"No reviews found"})
    //     return
    // }
    
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
