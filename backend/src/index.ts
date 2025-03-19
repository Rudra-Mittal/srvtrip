import express from 'express';
import { getPhotoUri, placeInfo } from './controllers/places';
import { generate } from './AiController1/main';
import { replacePlace } from './utils/replaceName';
import { extract2, generate2 } from './AIController2';
import { extractPlacesByRegex } from './AIController2/services/extractPlacesbyRegex';
import { convertItineraryToPara } from './AIController2/services/convertItineraryToPara';
import callWebScrapper from './controllers/callWebScrapper';
import checkPlaceInDb from './controllers/checkPlaceInDb';
import { saveItenary } from './utils/saveItenary';
import { placesData } from './utils/types';
import signup from './controllers/auth/signup';
import { signin } from './controllers/auth/signin';

const app = express();
const PORT = 4000;
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/api/auth/signup',(req,res)=>{
    const {email,password,name} = req.body;
    // doing some authentication generating token and saving to db
    signup(email,password,name).then((token)=>{
        res.cookie('token',token,{httpOnly:true});
        res.status(200).json({token,"message":"User created successfully"});
    }).catch((err)=>{
        console.log(err)
        res.status(403).json({"error":err.message});
    })
})
app.post('/api/auth/signin',(req,res)=>{
    const {email,password} = req.body;

    signin(email,password).then((token)=>{
        res.cookie('token',token,{httpOnly:true});

        res.status(200).json({token,"message":"User signed in successfully"});
    }).catch((err)=>{
        console.log(err)
        res.clearCookie('token');
        res.status(403).json({"error":err.message});
    })
})
// app.use(authMiddleware);
app.post('/api/itenary', async(req,res)=>{
    const {prompt} = req.body;
    //generating itenary
    // const itenary=await generate(prompt)
    const itenary=await generate2(prompt)

    // extracting places

    const allDayPlaces=  extractPlacesByRegex(itenary)//get the 2d array of places (daywise places)
    // getting places info
    
    const placesData= await Promise.all(
        allDayPlaces.map((dayPlaces, index) => 
            Promise.all(dayPlaces.map((place) => placeInfo(place, index + 1)))
        )
    ) as placesData;
    // check if the place Exist in db if no make a call to photos API and a scrapper API to get the place reviews

    for(const day of placesData){
        for(const place of day){

                // check if it exist in db by comparing with place id
                const checkPlace=await checkPlaceInDb(place.id);
                if(checkPlace){
                    //replace the place object with only place id in placesData
                    place.new=false;
                }
                else{
                    //call the photos api
                    const placePhotos=await Promise.all((place.photos?.map((reference:string)=>getPhotoUri(reference))));
                    //replace the photos ref url with actual url in place object
                    place.photos=placePhotos;

                    // make call to web scrapper and get summarized review
                    await callWebScrapper(place.displayName,6,place.id).then((review:any)=>{
                        console.log(review)
                            if(review.reviews.length==0){
                                callWebScrapper(`${place.displayName},${place.formattedAddress}`,6,place.id)
                            }
                    });
                }
        }
    }
    //   save all the data in db using saveItinerary function
    const response=saveItenary(itenary,placesData,"jnwdk");//last arg is userid

    // for(const place of placeData){
    //     console.log(place);
    // }
    console.log(placesData)
    // insert display name into jsonItenary
//   const newItenary =replacePlace(itenary,places,placeData.map(place=>place.id))
    // convert the json into text via AI
    res.send(placesData);
    return 
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});