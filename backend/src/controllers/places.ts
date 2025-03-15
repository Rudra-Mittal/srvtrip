import dotenv from 'dotenv';
dotenv.config();

export async function placeInfo(placename:string){
   
    return  fetch('https://places.googleapis.com/v1/places:searchText',{
        method:'POST',
        body:JSON.stringify({textQuery:placename}),
        headers:{
            'Content-Type':'application/json',
            'X-Goog-Api-Key':process.env.GOOGLE_PLACES_API_KEY as string,
            'X-Goog-FieldMask':'places.displayName,places.formattedAddress,places.priceLevel,places.id,places.photos'
        }
    }).
    then(async(da)=>{
        const data=await da.json();
        const res= data.places.map((place:any)=>{
            const photos= place.photos.map((photo:any)=>{
                return {
                    "url":"https://places.googleapis.com/v1/"+photo.name+`/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.GOOGLE_PLACES_API_KEY}`,
                    "width":photo.widthPx,
                    "height":photo.heightPx,
                }
            })
            return {
                "id":place.id,
                "formattedAddress":place.formattedAddress,
                "displayName":place.displayName.text,
                "photos":photos,
            }
        })
        return  res;

    })
    .catch((err)=>{
        console.log(err);
        return err
    });
}