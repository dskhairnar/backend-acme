export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    stack?: string
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const createApiError = {
  /**
   * 400 Bad Request
   */
  badRequest: (message: string = 'Bad Request') => new ApiError(message, 400),
  
  /**
   * 401 Unauthorized
   */
  unauthorized: (message: string = 'Unauthorized') => new ApiError(message, 401),
  
  /**
   * 403 Forbidden
   */
  forbidden: (message: string = 'Forbidden') => new ApiError(message, 403),
  
  /**
   * 404 Not Found
   */
  notFound: (message: string = 'Not Found') => new ApiError(message, 404),
  
  /**
   * 409 Conflict
   */
  conflict: (message: string = 'Conflict') => new ApiError(message, 409),
  
  /**
   * 422 Unprocessable Entity
   */
  unprocessableEntity: (message: string = 'Unprocessable Entity') => new ApiError(message, 422),
  
  /**
   * 500 Internal Server Error
   */
  internal: (message: string = 'Internal Server Error') => new ApiError(message, 500),
  
  /**
   * 503 Service Unavailable
   */
  serviceUnavailable: (message: string = 'Service Unavailable') => new ApiError(message, 503),
};
