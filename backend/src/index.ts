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
import { place, placesData } from './utils/types';
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
    const {prompt,userId} = req.body;
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
    const set= new Set();
    for(let day of placesData){
        for(let place of day){

                if(set.has(place.id)){
                    place.new=false;
                }else {
                    // check if it exist in db by comparing with place id
                    const checkPlace=await checkPlaceInDb(place.id);
                    if(checkPlace){
                        //replace the place object with only place id in placesData
                        place.new=false;
                        console.log(place)
                    }
                    else{
                        //call the photos api
                        set.add(place.id);
                        const placePhotos=await Promise.all((place.photos?.map((reference:string)=>getPhotoUri(reference))));
                        //replace the photos ref url with actual url in place object
                        place.photos=placePhotos;
                        
                    }
                    // make call to web scrapper and get summarized review
                }
            }
            await Promise.all((day.map((place:place)=>{
                if(place.new){
                    return callWebScrapper(place.displayName,5,place.id)
                    .then((res:any)=>{
                        place.summarizedReview=res.summarizedReview;
                    }).catch((err)=>{
                        console.log(err)
                        callWebScrapper(place.displayName+' , '+place.formattedAddress,5,place.id).then((res:any)=>{
                            place.summarizedReview=res.summarizedReview;
                        }).catch((err)=>{
                            console.log(err)
                            place.summarizedReview="No reviews found";
                        })
                    })
                }
            }))) 
    }
    //   save all the data in db using saveItinerary function
      const newItenary =replacePlace(itenary,placesData)
    const response=saveItenary(newItenary,placesData,userId);//last arg is userid

    // for(const place of placeData){
    //     console.log(place);
    // }
    console.log(response)
    // insert display name into jsonItenary
    // convert the json into text via AI
    res.send(response);
    return 
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
