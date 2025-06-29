import express from 'express';
import cors from 'cors';
import { firebaseAuth } from './middleware/firebaseAuth';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/authMiddleware';
import { signupRoute } from './controllers/auth/signupRoute';
import { signinRoute } from './controllers/auth/signinRoute';
import { genOtpRoute } from './controllers/auth/genOtpRoute';
import { verifyOtp } from './controllers/auth/verifyOtp';
import { signoutRoute } from './controllers/auth/signoutRoute';
import { userRoute } from './controllers/auth/userRoute';
import { sendForgotPasswordOtp } from './controllers/auth/sendForgotPasswordOtp';
import { verifyForgotPasswordOtp } from './controllers/auth/verifyForgotPasswordOtp';
import { resetPassword } from './controllers/auth/resetPassword';
import { itenaryRoute } from './controllers/itenaryRoute';
import { summarizeRoute } from './controllers/summarizeRoute';
import { queryRoute } from './controllers/queryRoute';
import { itenarariesRoute } from './controllers/itenarariesRoute';
import { serverAuthMiddleware } from './middleware/serverAuthMiddleware';
import { summaryRoute } from './utils/summaryRoute';
import { fetchItineraries } from './controllers/fetchitineraries';
import { 
  generalLimiter, 
  authLimiter, 
  otpLimiter, 
  otpEmailLimiter, 
  speedLimiter, 
  AIexpensiveLimiter,
  syncLimiter
} from './middleware/rateLimiter';
dotenv.config();
const app = express();
const PORT = 4000;
// Rate limiting
app.use(generalLimiter);
app.use(speedLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); // Enable cookie parsing middleware

app.use(cors({
  origin: [process.env.FRONTEND_URL as string,"http://localhost:5173"], // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Google-Auth', 'SERVER-API-KEY','Accept'], // Add X-API-KEY
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
})

// Auth routes with additional rate limiting
app.post('/signup', authLimiter, signupRoute);
app.post('/signin', authLimiter, firebaseAuth, signinRoute);
app.post('/generate-otp', otpLimiter, otpEmailLimiter, genOtpRoute);
app.post('/verify-otp', authLimiter, verifyOtp);
app.post('/forgot-password/send-otp', otpLimiter, otpEmailLimiter, sendForgotPasswordOtp);
app.post('/forgot-password/verify-otp', authLimiter, verifyForgotPasswordOtp);
app.post('/forgot-password/reset', authLimiter, resetPassword);
app.post('/api/auth/signout', signoutRoute)
app.get("/api/auth/user", authMiddleware, userRoute)

app.post('/api/summarize',serverAuthMiddleware, summarizeRoute)


app.use(authMiddleware);//use auth middleware for all routes after this line 
app.post('/api/fetchitineraries', syncLimiter, fetchItineraries)
app.post('/api/itenary',AIexpensiveLimiter, itenaryRoute)
app.get('/api/itineraries', itenarariesRoute)
app.post('/query', queryRoute)
app.get('/api/summarize', summaryRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


