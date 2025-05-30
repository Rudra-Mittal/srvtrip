import { Request, Response } from "express";
import { signin } from "./signin";
import { createUser, findByEmail } from "./usercontroller";
import jwt from 'jsonwebtoken';
import { signinSchema } from "../../zod/auth";

export const signinRoute=async (req:any, res:any) => {
  try {
    const validatedData = signinSchema.parse(req.body);
    const { email, password, googleAuth, name } = validatedData;
    console.log("Received signin request with:", { email, googleAuth, name });
    
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
          return res.status(500).json({ error: 'Failed to create user in database' });
        }
      }
      // Generate token with the database user ID
      const token = jwt.sign({ userId: user.id,email,name }, process.env.JWT_SECRET as string);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(200).json({ message: 'Google signin successful', token });
    }
    
    // Regular email/password signin
    if (!password) {
      return res.status(400).json({ error: 'Password is required for regular signin' });
    }
    
    try {
      const token = await signin(email, password);
      console.log("Generated token:", token);
      
      // Get user data to send back
      const user = await findByEmail(email);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      return res.status(200).json({ 
        message: 'Signin successful', 
        token,
        name: user?.name || 'User',
        email: email
      });
    } catch (signInErr: any) {
      console.error('Regular signin error:', signInErr);
      return res.status(401).json({ error: signInErr.message || 'Invalid credentials' });
    }
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    console.error('Signin error:', err);
    res.clearCookie('token');
    return res.status(500).json({ error: 'Internal server error' });
  }
}