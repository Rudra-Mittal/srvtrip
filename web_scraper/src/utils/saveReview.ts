import { insertData } from "../controllers/insertReview"
import summarizeReview from "../controllers/summarizeReview"
import dotenv from 'dotenv'
dotenv.config()
const BACKEND_URL=process.env.BACKEND_URL as string
export async function saveReview(review:any,placeId:string){
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
                    return ({message:"Reviews scrapped successfully",data:review})
                })
        }else{
            return ({message:"No reviews found"})
        }
}