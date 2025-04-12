import { otps } from "./otpMap";
import jwt from "jsonwebtoken";
import { createUser } from "./usercontroller";
import { Request, Response } from "express";

export const verifyOtp=async (req : any, res : any) => {
  try {
    const { email, otp, password, name } = req.body;

    // Check if the OTP exists and is valid
    const storedOtp = otps.get(email);
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // OTP is valid, proceed with the existing signup logic

    try {
      const dbUser = await createUser(email, password, name);

      // Generate token with the database user ID
      const token = jwt.sign({ userId: dbUser.id,name,email}, process.env.JWT_SECRET as string);

      
      // Remove the OTP after successful verification
      otps.delete(email);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ token, message: 'Signup successful' });
      return 
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
}