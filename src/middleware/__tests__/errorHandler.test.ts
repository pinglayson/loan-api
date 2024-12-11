// tests/errorHandler.test.ts
import { Request, Response } from 'express';
import { errorHandler } from '../errorHandler';
import createHttpError from 'http-errors';
import { ValidationError } from 'express-validator';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should handle HTTP errors', () => {
    const httpError = createHttpError(404, 'Not Found');
    
    errorHandler(httpError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Not Found',
        status: 404
      }
    });
  });

  it('should handle validation errors', () => {
    const validationError = {
      errors: [
        {
          type: 'field',
          path: 'email',
          msg: 'Invalid email'
        }
      ] as ValidationError[]
    };

    errorHandler(validationError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{
        field: 'email',
        message: 'Invalid email'
      }]
    });
  });

  it('should handle unexpected errors', () => {
    const unexpectedError = new Error('Something went wrong');
    
    errorHandler(unexpectedError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(consoleSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Something went wrong',
        status: 500
      }
    });
  });

  it('should use default message for unexpected errors without message', () => {
    const emptyError = { message: '' };
    
    errorHandler(emptyError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Internal Server Error',
        status: 500
      }
    });
  });

  it('should handle non-field validation errors', () => {
    const validationError = {
      errors: [
        {
          type: 'alternative',
          msg: 'General validation error'
        }
      ] as ValidationError[]
    };

    errorHandler(validationError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{
        field: '',
        message: 'General validation error'
      }]
    });
  });
});