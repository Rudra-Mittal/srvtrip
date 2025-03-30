import express from 'express';
import { getPhotoUri, placeInfo } from './controllers/places';
import { generate } from './AiController1/main';
import { replacePlace } from './utils/replaceName';
import { extract2, generate2 } from './AIController2';
import { extractPlacesByRegex } from './AIController2/services/extractPlacesbyRegex';
import { convertItineraryToPara } from './AIController2/services/convertItineraryToPara';
import callWebScrapper from './controllers/callWebScrapper';
import checkPlaceInDb from './controllers/checkPlaceInDb';
// import { saveItenary } from './utils/saveItenary';
import { place, placesData } from './utils/types';
import signup from './controllers/auth/signup';
import { signin } from './controllers/auth/signin';
import insertPlace from './controllers/checkPlaceInDb';
import { Prisma, PrismaClient } from '@prisma/client';
import saveItenary from './utils/createItenary';
import checkPlace from './controllers/checkPlaceInDb';
import connectPlace from './utils/connectPlace';
import createPlace from './utils/createPlace';
import createItenary from './utils/createItenary';
import createDay from './utils/createDay';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 4000;
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing middleware

// Define a custom interface extending Express Request
interface AuthRequest extends Request {
    user?: {
      userId: string;
      // Add other properties from your JWT payload if needed
    };
}

const authMiddleware=(req:AuthRequest,res:Response,next:NextFunction)=>{
    const token=req.cookies.token;
    if(!token){
        res.status(401).json({"error":"Unauthorized:No token provided"});
        return
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string };
        req.user={userId:decoded.userId};//adding userId to request object
        next();
    }
    catch(err){
        res.status(401).json({"error":"Unauthorized:Invalid token"});
        return
    }
}


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

app.post('/api/auth/signout',(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({"message":"User signed out successfully"});
})

app.use(authMiddleware);//use auth middleware for all routes after this line 

app.post('/api/itenary', async(req:AuthRequest,res)=>{
    const {prompt} = req.body;
    console.log(prompt);
    //generating itenary
    // const itenary=await generate(prompt)

    const userId=req.user?.userId;//get userId from token

    if(!userId){
        res.status(403).json({"error":"User not found"});
        return
    }

    const itenary=await generate2(prompt)

    const allDayPlaces=  extractPlacesByRegex(itenary)//get the 2d array of places (daywise places)
    
    const placesData= await Promise.all(
        allDayPlaces.map((dayPlaces, index) => 
            Promise.all(dayPlaces.map((place) => placeInfo(place, index + 1)))
        )
    ) as placesData;
    let dayNum=0
    const newItenary =replacePlace(itenary,placesData)
    const itenaryid= await createItenary(newItenary,userId);
    if(!itenaryid)  {
        res.status(403).json({"error":"User not found"});
        return
    }
    for(const day of placesData){
        const dayId= await createDay(dayNum,itenaryid,newItenary);
        for(const place of day){
            const placeId=await checkPlace(place);
            if(placeId.id){
                console.log("Place already exist in db")
                const id= connectPlace(placeId.id,dayId);
                if(!id){
                    console.log("Error connecting place")
                }
            }
            else  {
                //call the photos api
                const placePhotos=await Promise.all((place.photos?.map((reference:string)=>getPhotoUri(reference))));
             
                const placeD= createPlace(place,dayId,placePhotos);
                if(!placeD){
                    console.log("Error creating place")
                }
            }
            // make call to web scrapper and get summarized review
            }
            dayNum++;
            // await Promise.all((day.map((place:place)=>{
            //     if(!place.exist){
            //         return callWebScrapper(place.displayName,5,place.id)
            //         .then((res:any)=>{
            //             place.summarizedReview=res.summarizedReview;
            //         }).catch((err)=>{
            //             console.log(err)
            //             callWebScrapper(place.displayName+' , '+place.formattedAddress,5,place.id).then((res:any)=>{
            //                 place.summarizedReview=res.summarizedReview;
            //             }).catch((err)=>{
            //                 console.log(err)
            //                 place.summarizedReview="No reviews found";
            //             })
            //         })
            //     }
            // }))) 
    } 

    res.send(newItenary);
    return 
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

