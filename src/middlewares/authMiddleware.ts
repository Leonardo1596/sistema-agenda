import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../shared/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}