import nodemailer from 'nodemailer';
import { forgotPasswordOtps } from './forgotPasswordOtpMap';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendForgotPasswordOtp = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Check if OTP was recently sent
    const existingOtp = forgotPasswordOtps.get(email);
    if (existingOtp && existingOtp.expiresAt > Date.now()) {
      const timeLeft = Math.ceil((existingOtp.expiresAt - Date.now()) / (60 * 1000));
      return res.status(429).json({ 
        error: `OTP already sent. Please wait ${timeLeft} minutes before requesting a new one.` 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiration
    forgotPasswordOtps.set(email, { 
      otp, 
      expiresAt: Date.now() + 5 * 60 * 1000,
      verified: false
    });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - SrvTrip',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a4a4a;">Reset Your Password</h2>
          <p>You requested a password reset for your SrvTrip account. Use the following OTP to proceed:</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 5 minutes. If you didn't request this password reset, you can safely ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">© ${new Date().getFullYear()} SrvTrip. All rights reserved.</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (err: any) {
    console.error('Error sending forgot password OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};
