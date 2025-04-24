import weaviate from 'weaviate-client';
import dotenv from 'dotenv'
dotenv.config();
const weaviateURL = process.env.WEAVIATE_URL as string;
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string;
const jinaaiApiKey = process.env.JINAAI_API_KEY as string;
const mistralapikey= process.env.MISTRAL_API_KEY as string
const studioapikey= process.env.GOOGLE_API_KEY as string
import { createSchema } from '../utils/schema';
interface Review {
  reviews: string[];
  place: string;
  placeId: string;  
}

export async function insertData(reviews: Review):Promise<void> {
  console.log("studioapikey",studioapikey);
  console.log("inside insert reviews in weavite");
    const client = await weaviate.connectToWeaviateCloud(
      weaviateURL,
      { authCredentials: new weaviate.ApiKey(weaviateApiKey),
        headers:{
          'X-JinaAI-Api-Key': jinaaiApiKey,
          'X-Goog-Studio-Api-Key': studioapikey
        }
       }
    );
    const schemaName = "ReviewSchema";
    await createSchema(client,schemaName);
    const reviewSchema =  client.collections.get(schemaName);
     for(let i=0;i<reviews.reviews.length;i++){
      const uuid=await reviewSchema.data.insert({review:reviews.reviews[i],place:reviews.placeId});
      console.log(uuid)
     }
    console.log("Data inserted successfully!");
    return
}