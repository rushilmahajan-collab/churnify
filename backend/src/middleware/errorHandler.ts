import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { sendError } from '../utils/apiResponse';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(err);

  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.details, err.statusCode);
    return;
  }

  if (err instanceof ZodError) {
    sendError(
      res,
      'VALIDATION_ERROR',
      'Request validation failed',
      err.errors,
      422
    );
    return;
  }

  if (err instanceof SyntaxError) {
    sendError(res, 'INVALID_JSON', 'Invalid JSON in request body', undefined, 400);
    return;
  }

  sendError(
    res,
    'INTERNAL_ERROR',
    'An unexpected error occurred',
    undefined,
    500
  );
}
