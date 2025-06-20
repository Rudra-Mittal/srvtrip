import weaviate,{ dataType } from "weaviate-client";
import { WeaviateClient } from "weaviate-client";

export const reviewSchema = {
    name: "ReviewSchema",
    properties: [
      {
        name: 'place',
        dataType: dataType.TEXT,
      },
      {
        name:'placeId',
        dataType:dataType.TEXT,
      },
      {
        name: 'review',
        dataType: dataType.TEXT,
      },
    ],
    vectorizers: [
      weaviate.configure.vectorizer.text2VecJinaAI({
        name: 'review_vector',
        sourceProperties: ['review'],
        model:'jina-embeddings-v3'
      })
    ],
    generative: weaviate.configure.generative.google({
      modelId:'gemini-1.5-flash-latest'
    })
  };

  export async function createSchema(client: WeaviateClient,schemaName:string): Promise<boolean> {
    const schemaRes = await client.collections.exists(schemaName)
    const classExists = schemaRes;
    if (!classExists) {
      await client.collections.create(reviewSchema);
      // console.log(`Class ${schemaName} created successfully!`);
    }
    return classExists;

}
