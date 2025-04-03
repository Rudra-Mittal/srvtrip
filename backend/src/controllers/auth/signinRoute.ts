import { Request, Response } from "express";
import { signin } from "./signin";
import { createUser, findByEmail } from "./usercontroller";
import jwt from 'jsonwebtoken';

export const signinRoute=async (req:Request, res:Response) => {
  try {
    const { email, password, googleAuth, name } = req.body;
    console.log("Received signin request with:", { email, googleAuth, name });
    // console.log("Received signin request with:", { email, googleAuth, firebaseUserId, name });
    // For Google Auth, check if user exists or create them
    if (googleAuth) {
      // Check if user with this Firebase ID exists
      let user = await findByEmail(email);
      if (!user) {
        // If not, create the user directly with createUser
        try {
          user = await createUser(
            email, 
            'FIREBASE_AUTH', // Placeholder password for Google auth users
            name || 'User',
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
    // if (firebaseUserId) {
    //   // Find or create the user by Firebase ID
    //   let user = await findUserByFirebaseId(firebaseUserId);
      
    //   if (!user) {
    //     // This is unusual - they authenticated with Firebase but we don't have them in our DB
    //     try {
    //       user = await createUser(
    //         email, 
    //         'FIREBASE_AUTH', // Placeholder password
    //         name || 'User',
    //       );
    //     } catch (dbErr) {
    //       console.error('Firebase user creation error:', dbErr);
    //       res.status(500).json({ error: 'Failed to create user in database' });
    //       return;
    //     }
    //   }
      
    //   // Generate token with the database user ID
    //   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
      
    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //   });
      
    //   res.status(200).json({ token });
    //   return;
    // }
    
    // Regular email/password signin only if Firebase ID isn't provided
    if (!password) {
      res.status(400).json({ error: 'Password is required for regular signin' });
      return;
    }
    
    try {
      const token = await signin(email, password);
      console.log("Generated token:", token);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).send("success");
      return
    } catch (signInErr) {
      console.error('Regular signin error:', signInErr);
      res.status(401).json({ error: 'Invalid credentials' });
      return
    }
  } catch (err: any) {
    console.error('Signin error:', err);
    res.clearCookie('token');
    res.status(403).json({ error: err.message });
    return
  }
}