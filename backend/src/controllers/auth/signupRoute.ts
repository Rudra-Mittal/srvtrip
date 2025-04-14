import { Request, Response } from "express";
import signup from "./signup";
import { findByEmail } from "./usercontroller";
import jwt from 'jsonwebtoken';

export const signupRoute=async (req:Request, res:Response) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user with this Firebase ID already exists
    const existingUser = await findByEmail(email);
    if (existingUser) {
      // Just return a token for the existing user
      const token = jwt.sign({ userId: existingUser.id,name,email }, process.env.JWT_SECRET as string); 
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ token });
      return;
    }
    
    // Create user in your database using the createUser function directly
    try {
      const token = await signup(email, password, name);
      
      // Generate token with the database user ID
      console.log("Generated token:", token);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ token });
      return
    } catch (dbErr) {
      console.error('Database user creation error:', dbErr);
      res.status(500).json({ error: 'Failed to create user in database' });
      return
    }
  } catch (err: any) {
    console.error('Signup error:', err);
    res.clearCookie('token');
    res.status(403).json({ error: err.message });
    return
  }
}