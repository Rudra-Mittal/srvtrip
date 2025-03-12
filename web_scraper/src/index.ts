import { insertData } from "./controllers/insertReview";
import express from "express";
import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";
import { searchQuery } from "./controllers/getSimilar";
// const places=["Taj mahal","Marine Drive","Dominos, Chandigarh"];
const app= express();
app.use(express.json())


// auth middleware pending
app.post('/scraper',async (req,res)=>{
    const {placeName,maxScrolls}=req.body;
    const review=await scrapeGoogleMapsReviews(placeName,maxScrolls);
    if(review.reviews.length>0) insertData(review)
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
