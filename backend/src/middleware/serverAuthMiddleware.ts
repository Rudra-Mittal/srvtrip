import { Request, Response, NextFunction } from 'express';

export function serverAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['server-api-key'] as string | undefined;
//   const authorization = req.headers['authorization'];

//   if (!authorization) {
//     res.status(401).json({ error: 'Unauthorized' });
//     return;
//   }

  if (!apiKey || apiKey !== process.env.SERVER_API_KEY) {
    res.status(401).json({ error: 'Unauthorized: Invalid server API key' });
    return;
  }

  next();
}
