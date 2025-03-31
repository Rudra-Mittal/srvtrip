import express from 'express';
import { getPhotoUri, placeInfo } from './controllers/places';
import { generate } from './AiController1/main';
import cors from 'cors';
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
// import { authMiddleware } from './middlewares/authMiddleware';
import { firebaseAuth } from './middleware/firebaseAuth';
import { createUser, findUserByFirebaseId } from './controllers/auth/usercontroller';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();
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

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Important for cookies
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/signup', firebaseAuth, async (req, res) => {
  try {
    const { email, password, name, firebaseUserId } = req.body;
    
    // Check if user with this Firebase ID already exists
    const existingUser = await findUserByFirebaseId(firebaseUserId);
    if (existingUser) {
      // Just return a token for the existing user
      const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET as string);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ token });
      return;
    }
    
    // Create user in your database using the createUser function directly
    try {
      const dbUser = await createUser(email, password, name, firebaseUserId);
      
      // Generate token with the database user ID
      const token = jwt.sign({ userId: dbUser.id }, process.env.JWT_SECRET as string);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ token });
    } catch (dbErr) {
      console.error('Database user creation error:', dbErr);
      res.status(500).json({ error: 'Failed to create user in database' });
    }
  } catch (err: any) {
    console.error('Signup error:', err);
    res.clearCookie('token');
    res.status(403).json({ error: err.message });
  }
});
  
app.post('/signin', firebaseAuth, async (req, res) => {
  try {
    const { email, password, googleAuth, firebaseUserId, name } = req.body;
    
    console.log("Received signin request with:", { email, googleAuth, firebaseUserId, name });
    
    // For Google Auth, check if user exists or create them
    if (googleAuth) {
      // Check if user with this Firebase ID exists
      let user = await findUserByFirebaseId(firebaseUserId);
      
      if (!user) {
        // If not, create the user directly with createUser
        try {
          user = await createUser(
            email, 
            'FIREBASE_AUTH', // Placeholder password for Google auth users
            name || 'User',
            firebaseUserId
          );
        } catch (dbErr) {
          console.error('Google auth user creation error:', dbErr);
          res.status(500).json({ error: 'Failed to create user in database' });
          return;
        }
      }
      
      // Generate token with the database user ID
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ token });
      return;
    }
    
    // Check if the user has a Firebase ID
    if (firebaseUserId) {
      // Find or create the user by Firebase ID
      let user = await findUserByFirebaseId(firebaseUserId);
      
      if (!user) {
        // This is unusual - they authenticated with Firebase but we don't have them in our DB
        try {
          user = await createUser(
            email, 
            'FIREBASE_AUTH', // Placeholder password
            name || 'User',
            firebaseUserId
          );
        } catch (dbErr) {
          console.error('Firebase user creation error:', dbErr);
          res.status(500).json({ error: 'Failed to create user in database' });
          return;
        }
      }
      
      // Generate token with the database user ID
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ token });
      return;
    }
    
    // Regular email/password signin only if Firebase ID isn't provided
    if (!password) {
      res.status(400).json({ error: 'Password is required for regular signin' });
      return;
    }
    
    try {
      const token = await signin(email, password);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ token });
    } catch (signInErr) {
      console.error('Regular signin error:', signInErr);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err: any) {
    console.error('Signin error:', err);
    res.clearCookie('token');
    res.status(403).json({ error: err.message });
  }
});

const otps = new Map<string, { otp: string; expiresAt: number }>(); // Temporary in-memory storage for OTPs

app.post('/generate-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP with a 5-minute expiration
    otps.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Send the OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Signup',
      text: `Your OTP for signup is: ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});


app.post('/verify-otp', async (req : any, res : any) => {
  try {
    const { email, otp, password, name } = req.body;

    // Check if the OTP exists and is valid
    const storedOtp = otps.get(email);
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // OTP is valid, proceed with the existing signup logic
    const firebaseUserId = 'TEMP_FIREBASE_ID'; // Replace with actual Firebase ID if needed

    try {
      const dbUser = await createUser(email, password, name, firebaseUserId);

      // Generate token with the database user ID
      const token = jwt.sign({ userId: dbUser.id }, process.env.JWT_SECRET as string);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Remove the OTP after successful verification
      otps.delete(email);

      res.status(200).json({ token, message: 'Signup successful' });
    } catch (err: any) {
      if (err.message.includes('User already exists')) {
        console.error('User already exists:', err.message);
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      throw err;
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// app.post('/api/auth/signup',(req,res)=>{
//     const {email,password,name} = req.body;
//     // doing some authentication generating token and saving to db
//     signup(email,password,name).then((token)=>{
//         res.cookie('token',token,{httpOnly:true});
//         res.status(200).json({token,"message":"User created successfully"});
//     }).catch((err)=>{
//         console.log(err)
//         res.status(403).json({"error":err.message});
//     })
// })
// app.post('/api/auth/signin',(req,res)=>{
//     const {email,password} = req.body;

//     signin(email,password).then((token)=>{
//         res.cookie('token',token,{httpOnly:true});

//         res.status(200).json({token,"message":"User signed in successfully"});
//     }).catch((err)=>{
//         console.log(err)
//         res.clearCookie('token');
//         res.status(403).json({"error":err.message});
//     })
// })

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

