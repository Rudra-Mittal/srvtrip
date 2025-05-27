import dotenv from 'dotenv';
dotenv.config();
export default async function callWebScrapper(placeName:string,maxScrolls:Number,placeId:string,placeAddress:string){
   return fetch(process.env.LOAD_BALANCER_URL as string,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'server-api-key': `${process.env.SERVER_API_KEY}`
        },
        body:JSON.stringify({placeName,maxScrolls,placeId,placeAddress})
    }).then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        return data;
    }).catch((err)=>{
        console.log("Error in sending request",err)
    });
}