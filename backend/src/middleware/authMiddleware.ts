import jwt from 'jsonwebtoken';
import { AuthRequest } from '../utils/types';
import { NextFunction, Response } from 'express';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ "error": "Unauthorized:No token provided" });
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string,email:string,name:string };
    req.user = { userId: decoded.userId,email:decoded.email, name:decoded.name};//adding userId to request object
    next();
  }
  catch (err) {
    res.status(401).json({ "error": "Unauthorized:Invalid token" });
    return
  }
}