import weaviate from 'weaviate-client';
import dotenv from 'dotenv';
dotenv.config();
const weaviateURL = process.env.WEAVIATE_URL as string 
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string
const jinaaiApiKey = process.env.JINAAI_API_KEY as string
const mistralapikey= process.env.MISTRAL_API_KEY as string
const studioapikey= process.env.GOOGLE_API_KEY as string


export async function searchQuery(query:string,placeId:string, limit:number):Promise<String>{
  console.log("Weaviate URL",weaviateURL," Weaviate API Key",weaviateApiKey," Jina AI API Key",jinaaiApiKey," Mistral API Key",mistralapikey," Studio API Key",studioapikey)
  const client = await weaviate.connectToWeaviateCloud(
    weaviateURL,
    { authCredentials: new weaviate.ApiKey(weaviateApiKey),
      headers:{
        'X-JinaAI-Api-Key': jinaaiApiKey,
        'X-Goog-Studio-Api-Key': studioapikey,
      }
     }
  );
    const jeopardy = client.collections.get('ReviewSchema');
    const resGen= await jeopardy.generate.nearText([query],{
      groupedTask:`You are a friendly travel assistant.If the user is asking a general question like "hi", "how are you", or just greeting, respond normally without using the reviews.
      If the user is asking about something related to the place (like best time to visit, what to do, ticket prices, etc.), use the reviews to answer based on what people say.
      Here is the query: "${query}". Respond accordingly. `
    },{
      filters: jeopardy.filter.byProperty('place').containsAny([placeId]),
      returnMetadata:['distance'],
      limit
    })
    console.log("\nReposne\n",resGen.generated);
    return JSON.stringify(resGen.generated, null, 5);
}
