import nodemailer from 'nodemailer';
import { otps } from './otpMap';
import { Request, Response } from 'express';

export const genOtpRoute=async (req:Request, res:Response) => {

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
    // console.log('Generated OTP:', otp, 'for email:', email,transporter);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Signup',
      text: `Your OTP for signup is: ${otp}. It is valid for 5 minutes.`,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a;">Verify Your Account</h2>
      <p>Thank you for registering with SrvTrip. To complete your registration, please use the following OTP:</p>
      <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP is valid for 5 minutes. If you didn't request this, you can safely ignore this email.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #777;">© ${new Date().getFullYear()} SrvTrip. All rights reserved.</p>
    </div>
  `, 
    });

    res.status(200).json({ message: 'OTP sent to email' });
    return 
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}