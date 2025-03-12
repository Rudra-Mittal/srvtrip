const weaviateURL = process.env.WEAVIATE_URL as string;
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string;
const jinaaiApiKey = process.env.JINAAI_API_KEY as string;
import weaviate from 'weaviate-client';
import dotenv from 'dotenv';
dotenv.config();

export async function searchQuery(query:string, limit:number):Promise<String>{
    const client = await weaviate.connectToWeaviateCloud(
      weaviateURL,
      { authCredentials: new weaviate.ApiKey(weaviateApiKey), 
        headers:{
          'X-JinaAI-Api-Key': jinaaiApiKey,
        }
      }
    );
    const jeopardy = client.collections.get('ReviewsVectored');
    const result = await jeopardy.query.nearText(query, {
    limit,
    returnMetadata: ['distance'],
  })
  return JSON.stringify(result.objects, null, 2);
}