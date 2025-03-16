import dotenv from 'dotenv';
dotenv.config();

export async function placeInfo(placename: string): Promise<any> {

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
            const data = await da.json() as any;
            const place= data.places[0];
            // check if this place exist already in db
            return {
                id:place.id,
                formattedAddress:place.formattedAddress,
                displayName:place.displayName.text,
                location:place.location,
                photos:place.photos.map((photo:any)=>photo.name)
            };
        })
        .catch((err) => {
            console.log(err);
            return err
        });
}

export async function getPhotoUri(photoreference:string,photwidth=600):Promise<string>{
    return fetch(`https://places.googleapis.com/v1/${photoreference}/media?key=${process.env.GOOGLE_PLACES_API_KEY}&maxWidthPx=${photwidth}&skipHttpRedirect=true`)
    .then(async (data) => {
        const res = await data.json() as any;
        return res.photoUri;
    })
    .catch((err) => {
        console.log(err);
        return err
    });
}