export default async function callWebScrapper(placeName:string,maxScrolls:Number,placeId:string){
   return fetch("http://localhost:3000/scraper",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({placeName,maxScrolls,placeId})
    }).then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        return data;
    });
}