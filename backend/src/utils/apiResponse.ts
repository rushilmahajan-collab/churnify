import { Response } from 'express';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  meta?: ApiSuccessResponse<T>['meta'],
  statusCode = 200
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  if (meta) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  details?: unknown,
  statusCode = 400
): Response {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };
  if (details) {
    response.error.details = details;
  }
  return res.status(statusCode).json(response);
}
