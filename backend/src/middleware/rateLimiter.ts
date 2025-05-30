import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict rate limiter for OTP requests
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 3 OTP requests per hour
  message: {
    error: 'Too many OTP requests, please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Speed limiter to slow down requests after threshold
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Additional OTP rate limiter by email (in-memory store)
const otpAttempts = new Map<string, { count: number; resetTime: number }>();

export const otpEmailLimiter = (req: any, res: any, next: any) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const now = Date.now();
  const userAttempts = otpAttempts.get(email);

  // Reset if window has passed
  if (!userAttempts || now > userAttempts.resetTime) {
    otpAttempts.set(email, { count: 1, resetTime: now + 60 * 60 * 1000 }); // 1 hour window
    return next();
  }

  // Check if limit exceeded
  if (userAttempts.count >= 3) {
    const timeLeft = Math.ceil((userAttempts.resetTime - now) / (60 * 1000));
    return res.status(429).json({ 
      error: `Too many OTP requests for this email. Try again in ${timeLeft} minutes.` 
    });
  }

  // Increment count
  userAttempts.count++;
  next();
};

export const AIexpensiveLimiter=rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per hour
  message: {
    error: 'Too many AI requests, please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
