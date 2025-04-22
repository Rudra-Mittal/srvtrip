import weaviate from 'weaviate-client';
import dotenv from 'dotenv';
dotenv.config();
const weaviateURL = process.env.WEAVIATE_URL as string 
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string
const jinaaiApiKey = process.env.JINAAI_API_KEY as string
const mistralapikey= process.env.MISTRAL_API_KEY as string
const studioapikey= process.env.GOOGLE_API_KEY as string
console.log("Weaviate URL",weaviateURL," Weaviate API Key",weaviateApiKey," Jina AI API Key",jinaaiApiKey," Mistral API Key",mistralapikey," Studio API Key",studioapikey)
export async function searchQuery(query:string,placeId:string, limit:number):Promise<String>{
  const client = await weaviate.connectToWeaviateCloud(
    weaviateURL,
    { authCredentials: new weaviate.ApiKey(weaviateApiKey),
      headers:{
        'X-JinaAI-Api-Key': jinaaiApiKey,
        'X-Goog-Studio-Api-Key': studioapikey 
      }
     }
  );
    const jeopardy = client.collections.get('ReviewSchema');
    const resGen= await jeopardy.generate.nearText([query],{
      groupedTask:`Provide the answer to the query ${query} according to these reviews `
    },{
      filters: jeopardy.filter.byProperty('place').containsAny([placeId]),
      returnMetadata:['distance'],
      limit
    })
    console.log("\nReposne\n",resGen.generated);
    return JSON.stringify(resGen.generated, null, 5);
}
