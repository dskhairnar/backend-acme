import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from '../utils/ApiError';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));
    
    throw new ApiError('Validation failed', 400);
  }
  
  next();
};

export const validate = (validations: ValidationChain[]) => {
  return [...validations, handleValidationErrors];
};

export const customValidationMessage = (field: string, message: string): string => {
  return `${field}: ${message}`;
};
