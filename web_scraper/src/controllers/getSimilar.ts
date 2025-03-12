import weaviate from 'weaviate-client';
import dotenv from 'dotenv';
dotenv.config();
const weaviateURL = process.env.WEAVIATE_URL as string 
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string
const jinaaiApiKey = process.env.JINAAI_API_KEY as string
export async function searchQuery(query:string,place:string, limit:number):Promise<String>{
  const client = await weaviate.connectToWeaviateCloud(
    weaviateURL,
    { authCredentials: new weaviate.ApiKey(weaviateApiKey),
      headers:{
        'X-JinaAI-Api-Key': jinaaiApiKey,
      }
     }
  );
    const jeopardy = client.collections.get('ReviewSchema');
    const result = await jeopardy.query.nearText(query,{
      filters: jeopardy.filter.byProperty('place').containsAny([place]),
      returnMetadata:['distance'],
      limit,
    })
  console.log(result.objects)
  return JSON.stringify(result.objects, null, 5);
}
