import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const firebaseAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('Token:', token);
    
    try {
      // Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Add user ID to request
      req.body.firebaseUserId = decodedToken.uid;
      
      next();
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  } catch (err) {
    console.error('Firebase auth middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};