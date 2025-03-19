import weaviate from 'weaviate-client';
import dotenv from 'dotenv';
dotenv.config();
const weaviateURL = process.env.WEAVIATE_URL as string 
const weaviateApiKey = process.env.WEAVIATE_API_KEY as string
const jinaaiApiKey = process.env.JINAAI_API_KEY as string
const mistralapikey= process.env.MISTRAL_API_KEY as string
const studioapikey= process.env.GOOGLE_API_KEY as string
export default async function summarizeReview(query:string,placeId:string):Promise<String>{
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
      groupedTask:`${query}`
    },{
      filters: jeopardy.filter.byProperty('place').containsAny([placeId]),
    })
    console.log("\nReposne of summarized review\n",resGen.generated);
    return JSON.stringify([resGen.objects,resGen.generated], null, 5);
}
