import express from 'express';
import { getPhotoUri, placeInfo } from './controllers/places';
import { generate } from './AiController1/main';
import { extractPlaces } from './AiController1/services/extractplaces';
import { replacePlace } from './utils/replaceName';

const app = express();
const PORT = 3000;
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/api/auth',(req,res)=>{
    // const {username,password} = req.body;
    // console.log(username,password)
    // doing some authentication generating token and saving to db
    res.send('Hello World!');
})
// app.use(authMiddleware);
app.post('/api/itenary', async(req,res)=>{
    const {prompt} = req.body;
    //generating itenary
    console.log(prompt)
    const itenary=await generate(prompt)
    // extracting places

    console.log(itenary)
    const places= await extractPlaces(itenary)
    console.log(places)
    // getting places info
    const placeData= await Promise.all((places.map(place=>placeInfo(place))))
    // check if the place Exist in db if no make a call to photos API and a scrapper API to get the place reviews
    const photos=[] as any
    for(const place of placeData){
        console.log(place.photos,place.displayName);
    }
    for(const place of placeData){
        // check if it exist in db by compairing with place id
        // console.log(place.photos)
        // if not
        // calling the photos API
         const placePhotos=await Promise.all((place.photos?.map((reference:string)=>getPhotoUri(reference))))
         photos.push(placePhotos)
         //  console.log(place.displayName,photos)

         // make call to web scrapper and get summarized review

        //   save all the data in db
    }
    // insert display name into jsonItenary
    replacePlace(itenary,places,placeData.map(place=>place.displayName))
    
    // convert the json into text via AI
    res.send(JSON.stringify({itenary,placeData,photos}));
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});