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
const BACKEND_URL=process.env.BACKEND_URL as string
// auth middleware pending
app.post('/scraper',async (req,res)=>{
    const {placeName,maxScrolls,placeId}=req.body;
    const review=await scrapeGoogleMapsReviews(placeName,maxScrolls);
    // console.log(review)
    if(review.reviews.length>0) {
        insertData({...review,placeId}).then(()=>{
            summarizeReview(placeId).then((summarizedReview)=>{
                 fetch(BACKEND_URL+'/api/summarize',{
                    method:'POST',
                    body:JSON.stringify({review:summarizedReview,placeId}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                 })
                })
                res.status(200).json({message:"Reviews scrapped successfully",data:review})
                return 
            })
    }else{
        res.status(404).json({message:"No reviews found"})
        return
    }
    
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
