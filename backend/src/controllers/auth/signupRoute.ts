import { Request, Response } from "express";
import { findByEmail } from "./usercontroller";

export const signupRoute = async (req:any, res:any) => {
  try {
    const { email } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Redirect to OTP generation flow
    // No user creation happening at this point
    return res.status(200).json({ message: 'Please proceed with OTP verification' });
    
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}