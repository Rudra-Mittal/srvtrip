import { Request, Response } from "express";
import { findByEmail } from "./usercontroller";
import jwt from 'jsonwebtoken';
import { signupSchema } from "../../zod/auth";

export const signupRoute=async (req:any, res:any) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { email, password, name } = validatedData;
    
    // Check if user with this email already exists
    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Redirect to OTP generation flow
    // No user creation happening at this point
    return res.status(200).json({ message: 'Please proceed with OTP verification' });
    
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return
  }
  return 
}