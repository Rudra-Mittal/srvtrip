import { forgotPasswordOtps } from './forgotPasswordOtpMap';

export const verifyForgotPasswordOtp = async (req: any, res: any) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Check if OTP exists and is valid
    const storedOtp = forgotPasswordOtps.get(email);
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified but don't delete it yet (needed for password reset)
    storedOtp.verified = true;
    forgotPasswordOtps.set(email, storedOtp);

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err: any) {
    console.error('Error verifying forgot password OTP:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};
