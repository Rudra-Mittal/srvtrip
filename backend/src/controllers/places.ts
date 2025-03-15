import dotenv from 'dotenv';
dotenv.config();

export async function placeInfo(placename: string,photonum=3,photwidth=600): Promise<any> {

    return fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        body: JSON.stringify({ textQuery: placename }),
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY as string,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id,places.photos,places.location',
        }
    }).
        then(async (da) => {
            const data = await da.json();
            const place= data.places[0];
            const photoUris = await Promise.all(place.photos.slice(0,photonum).map((photo: any) => getPhotoUri(photo.name,photwidth)));
            return {
                id:place.id,
                formattedAddress:place.formattedAddress,
                displayName:place.displayName.text,
                location:place.location,
                photos:photoUris
            };
        })
        .catch((err) => {
            console.log(err);
            return err
        });
}

async function getPhotoUri(photoreference:string,photwidth:number):Promise<string>{
    return fetch(`https://places.googleapis.com/v1/${photoreference}/media?key=${process.env.GOOGLE_PLACES_API_KEY}&maxWidthPx=${photwidth}&skipHttpRedirect=true`)
    .then(async (data) => {
        const res = await data.json();
        return res.photoUri;
    })
    .catch((err) => {
        console.log(err);
        return err
    });
}