import { Request, Response, NextFunction } from 'express';

export function verifyServerApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['server-api-key'] as string | undefined;

  if (!apiKey || apiKey !== process.env.SERVER_API_KEY) {
    res.status(401).json({ error: 'Unauthorized: Invalid server API key' });
    return;
  }

  next();
}
