import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export function serverAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['server-api-key'] as string | undefined;
  console.log("API Key:", apiKey);
//   const authorization = req.headers['authorization'];

//   if (!authorization) {
//     res.status(401).json({ error: 'Unauthorized' });
//     return;
//   }

  if (!apiKey || apiKey !== process.env.SERVER_API_KEY) {
    res.status(401).json({ error: 'Unauthorized: Invalid server API key' });
    return;
  }
  console.log("API Key is valid");
  next();
}
