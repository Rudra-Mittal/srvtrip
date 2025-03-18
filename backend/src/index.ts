import express from 'express';
import { getPhotoUri, placeInfo } from './controllers/places';
import { generate } from './AiController1/main';
import { replacePlace } from './utils/replaceName';
import { extract2, generate2 } from './AIController2';
import { extractPlacesByRegex } from './AIController2/services/extractPlacesbyRegex';
import { convertItineraryToPara } from './AIController2/services/convertItineraryToPara';
import callWebScrapper from './controllers/callWebScrapper';

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
    // const itenary=await generate(prompt)
    const itenary=await generate2(prompt)

    // extracting places

    console.log(await JSON.parse(itenary))
    const allDayPlaces=  extractPlacesByRegex(itenary)//get the 2d array of places (daywise places)
    // getting places info
    
    const placesData= await Promise.all(
        allDayPlaces.map((dayPlaces, index) => 
            Promise.all(dayPlaces.map((place) => placeInfo(place, index + 1)))
        )
    );
    // check if the place Exist in db if no make a call to photos API and a scrapper API to get the place reviews
    // const photos=[] as any
    for(const day of placesData){
        for(const place of day){

            //     // check if it exist in db by compairing with place id
            
            //     // if not
            //     // calling the photos API
            const placePhotos=await Promise.all((place.photos?.map((reference:string)=>getPhotoUri(reference))))
            //      photos.push(placePhotos)
                 place.photos=placePhotos
            //      //  console.log(place.displayName,photos)
            
            //      // make call to web scrapper and get summarized review
            //     //  const summarizedReview=callWebScrapper(place.displayName,2,place.id);
            
            //     //   save all the data in db
        }
        }
    // for(const place of placeData){
    //     console.log(place);
    // }
    // insert display name into jsonItenary
//    const newItenary= replacePlace(itenary,places,placeData.map(place=>place.displayName))
//   const newItenary =replacePlace(itenary,places,placeData.map(place=>place.id))
    // convert the json into text via AI
    res.send(placesData);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});