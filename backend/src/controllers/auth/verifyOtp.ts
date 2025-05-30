import { otps } from "./otpMap";
import jwt from "jsonwebtoken";
import { createUser } from "./usercontroller";
import { Request, Response } from "express";

export const verifyOtp = async (req:any , res: any) => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the OTP exists and is valid
    const storedOtp = otps.get(email);
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    try {
      // Create user only after OTP verification
      const dbUser = await createUser(email, password, name);

      // Generate token with the database user ID
      const token = jwt.sign({ userId: dbUser.id, name, email }, process.env.JWT_SECRET as string);

      // Remove the OTP after successful verification
      otps.delete(email);
      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(200).json({ message: 'Account created successfully', token });
    } catch (err: any) {
      console.error('Error creating user:', err);
      return res.status(400).json({ error: err.message || 'Failed to create user account' });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}