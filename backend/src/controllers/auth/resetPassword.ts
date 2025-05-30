import { forgotPasswordOtps } from './forgotPasswordOtpMap';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const resetPassword = async (req: any, res: any) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if OTP exists, is valid, and has been verified
    const storedOtp = forgotPasswordOtps.get(email);
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now() || !storedOtp.verified) {
      return res.status(400).json({ error: 'Invalid or expired OTP, or OTP not verified' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Check if user exists before updating
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password in database
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Remove the OTP after successful password reset
    forgotPasswordOtps.delete(email);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err: any) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
