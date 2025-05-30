export interface ForgotPasswordOtp {
  otp: string;
  expiresAt: number;
  verified: boolean;
}

export const forgotPasswordOtps = new Map<string, ForgotPasswordOtp>();
