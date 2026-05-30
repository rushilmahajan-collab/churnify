import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      orgId?: string;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('AUTH_REQUIRED', 'No valid token provided', 401);
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token);

    if (!payload) {
      throw new AppError('AUTH_INVALID', 'Token is malformed or invalid', 401);
    }

    req.user = payload;
    req.orgId = payload.orgId;

    next();
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('AUTH_INVALID', 'Token verification failed', 401));
  }
}
