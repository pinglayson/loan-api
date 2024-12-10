import { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { ValidationError } from 'express-validator';

interface CustomError {
  status?: number;
  message: string;
  errors?: ValidationError[];
}

export const errorHandler: ErrorRequestHandler = (err: CustomError, req, res, next): void => {
  // Only log unexpected errors
  if (!err.status && !err.errors) {
    console.error('Unexpected error:', err);
  }

  // Handle HTTP errors
  if (err instanceof HttpError) {
    res.status(err.status || 500).json({ 
      error: {
        message: err.message,
        status: err.status
      }
    });
    return;
  }

  // Handle validation errors
  if (Array.isArray(err.errors)) {
    res.status(400).json({ 
      errors: err.errors.map(e => ({
        field: e.type === 'field' ? e.path : '',
        message: e.msg
      }))
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: 500
    }
  });
};