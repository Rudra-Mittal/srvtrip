import dotenv from 'dotenv';
dotenv.config();

export async function placeInfo(placename: string,dayNum:number,photoLimit=5): Promise<any> {
    console.log(placename)
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
            console.log("Places data from places api:",data)
            //check if any place is found or the place is not found (if gibberish or not a place)
            if(!data.places||data.places.length==0){
                console.log("No place found for this name")
                //this is just to check if the place is not found or gibberish from the form data destination
                return{
                    notfound :true,
                }
            }
            const place= data.places[0];
            // console.log("Place data:",place)
            // check if this place exist already in db
            return {
                placename:placename,
                dbId:"",
                id:place.id,
                formattedAddress:place.formattedAddress,
                displayName:place.displayName.text,
                location:place.location,
                photos:(place.photos)?place.photos.slice(0,photoLimit).map((photo:any)=>photo.name):""
            };
        })
        .catch((err) => {
            console.log(err);
            return err
        });
}

export async function getPhotoUri(photoreference: string, photwidth = 600): Promise<string> {
    try {
        const response = await fetch(`https://places.googleapis.com/v1/${photoreference}/media?key=${process.env.GOOGLE_PLACES_API_KEY}&maxWidthPx=${photwidth}&skipHttpRedirect=true`);
        
        if (!response.ok) {
            console.error(`API returned ${response.status}: ${response.statusText}`);
            return getNoPhotoPlaceholder(photwidth);
        }
        
        const res = await response.json();
        
        if (!res.photoUri) {
            console.warn(`No photoUri property in response for ${photoreference}`);
            return getNoPhotoPlaceholder(photwidth);
        }
        
        return res.photoUri;
    } catch (err) {
        console.error(`Error fetching photo ${photoreference}:`, err);
        return getNoPhotoPlaceholder(photwidth);
    }
}

function getNoPhotoPlaceholder(width: number = 600): string {
    // Calculate height based on standard 3:2 aspect ratio
    const height = Math.floor(width * 2/3);
    
    // Create a professional-looking SVG with camera icon and text
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <g transform="translate(${width/2}, ${height/2})">
            <!-- Camera body -->
            <rect x="-80" y="-30" width="160" height="90" rx="10" fill="#d1d5db"/>
            <!-- Camera lens -->
            <circle cx="0" cy="15" r="30" fill="#9ca3af" stroke="#f3f4f6" stroke-width="3"/>
            <circle cx="0" cy="15" r="15" fill="#6b7280"/>
            <!-- Camera flash -->
            <rect x="40" y="-40" width="20" height="10" rx="3" fill="#9ca3af"/>
            <!-- Diagonal line (slash) -->
            <line x1="-70" y1="-50" x2="70" y2="70" stroke="#ef4444" stroke-width="8"/>
            <!-- Text -->
            <text x="0" y="${height/4}" font-family="Arial, sans-serif" font-size="${width/25}" text-anchor="middle" fill="#4b5563" font-weight="bold">No Image Available</text>
        </g>
    </svg>`;
    
    // Convert SVG to a data URI
    const encodedSvg = encodeURIComponent(svg);
    return `data:image/svg+xml;charset=UTF-8,${encodedSvg}`;
}