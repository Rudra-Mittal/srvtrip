import weaviate, { vectorizer } from 'weaviate-client';
import dotenv from 'dotenv'
dotenv.config();
import { reviewSchema } from '../utils/schema';
const weaviateURL = process.env.WEAVIATE_URL as string;
const jinaaiApiKey = process.env.JINAAI_API_KEY as string;
const mistralapikey= process.env.MISTRAL_API_KEY as string
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string;
export async function migrateData(WEAVIATE_URL:string, WEAVIATE_API_KEY:string){
    try{
      const client = await weaviate.connectToWeaviateCloud(
        weaviateURL,
        { authCredentials: new weaviate.ApiKey(weaviateApiKey),
         }
      );
      const newClient = await weaviate.connectToWeaviateCloud(
        WEAVIATE_URL,
        { authCredentials: new weaviate.ApiKey(WEAVIATE_API_KEY),
          headers:{
            'X-JinaAI-Api-Key': jinaaiApiKey,
            'X-Mistral-Api-Key': mistralapikey
          }
        } 
      );
      const reviews= client.collections.get("ReviewSchema");
      await newClient.collections.create(reviewSchema)
      const exists= await newClient.collections.exists("ReviewSchema");
      if(!exists) return {"error":"Collection not created"}
      const newCollection= newClient.collections.get("ReviewSchema");
      const reviewData=await reviews.query.fetchObjects({includeVector:true,limit:100000});
        for(const review of reviewData.objects){
           const res= await newCollection.data.insert({
                properties:{
                  review:review.properties.review,
                  place:review.properties.place,
                },
                vectors:{
                  review_vector:review.vectors.review_vector
                },
                id:review.uuid
            })
            console.log("Collection migrated",res)
        }
      return {"message":"Data migrated successfully"}
    }catch(err){
      console.log(err)
      return {"error":"Server error"}
    }
}