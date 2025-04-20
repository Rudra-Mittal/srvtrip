import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  name: z.string().min(1),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  googleAuth: z.boolean().optional(),
  name: z.string().optional(),
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(6),
  name: z.string().min(1),
});
