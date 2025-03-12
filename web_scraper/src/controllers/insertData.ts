import weaviate from 'weaviate-client';
import dotenv from 'dotenv'
dotenv.config();
const weaviateURL = process.env.WEAVIATE_URL as string;
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string;
const jinaaiApiKey = process.env.JINAAI_API_KEY as string;
import fs from 'fs';
export async function insertData() {
    const client = await weaviate.connectToWeaviateCloud(
      weaviateURL,
      { authCredentials: new weaviate.ApiKey(weaviateApiKey),
        headers:{
          'X-JinaAI-Api-Key': jinaaiApiKey,
        }
       }
    );
    const jsonData = JSON.parse(fs.readFileSync('../data.json', 'utf-8'));
    const className = "reviews";
    
    const reviewSchema =  client.collections.get(className);
      const uuid=await reviewSchema.data.insertMany(jsonData)
      console.log(uuid)
    console.log("Data inserted successfully!");
  }