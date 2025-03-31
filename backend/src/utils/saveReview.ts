import { PrismaClient } from "@prisma/client";

export default async function saveReview(review:string,rating:number,placeId:string):Promise<string|null>{
    const prisma=new PrismaClient();
    // console.log(rating)
   try{
    const reviewD=await prisma.place.update({
        where:{
            placeId:placeId
        },
        data:{
            summarizedReview:review,
            rating:rating
        }
    })
    // console.log(reviewD)
    return reviewD.id;
   }catch(err){
        console.log(err);
        return null;
   }
}