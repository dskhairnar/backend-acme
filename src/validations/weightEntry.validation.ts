import { body, param, query } from 'express-validator';
import { Types } from 'mongoose';

export const createWeightEntryValidation = [
  body('weight')
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('Weight must be a number between 0.1 and 1000')
    .toFloat(),

  body('recordedAt')
    .optional()
    .isISO8601()
    .withMessage('Recorded date must be a valid ISO 8601 date')
    .custom((value) => {
      const recordedDate = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      
      if (recordedDate > now) {
        throw new Error('Recorded date cannot be in the future');
      }
      
      if (recordedDate < oneYearAgo) {
        throw new Error('Recorded date cannot be more than one year ago');
      }
      
      return true;
    }),

  body('userId')
    .optional()
    .custom((value) => {
      if (value && !Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    })
];

export const updateWeightEntryValidation = [
  param('id')
    .notEmpty()
    .withMessage('Weight entry ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid weight entry ID format');
      }
      return true;
    }),

  body('weight')
    .optional()
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('Weight must be a number between 0.1 and 1000')
    .toFloat(),

  body('recordedAt')
    .optional()
    .isISO8601()
    .withMessage('Recorded date must be a valid ISO 8601 date')
    .custom((value) => {
      const recordedDate = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      
      if (recordedDate > now) {
        throw new Error('Recorded date cannot be in the future');
      }
      
      if (recordedDate < oneYearAgo) {
        throw new Error('Recorded date cannot be more than one year ago');
      }
      
      return true;
    })
];

export const weightEntryIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Weight entry ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid weight entry ID format');
      }
      return true;
    })
];

export const weightEntryQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && req.query?.startDate) {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(value);
        
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),

  query('minWeight')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('Minimum weight must be a positive number')
    .toFloat(),

  query('maxWeight')
    .optional()
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('Maximum weight must be between 0.1 and 1000')
    .toFloat()
    .custom((value, { req }) => {
      if (value && req.query?.minWeight) {
        const minWeight = parseFloat(req.query.minWeight as string);
        if (value <= minWeight) {
          throw new Error('Maximum weight must be greater than minimum weight');
        }
      }
      return true;
    }),

  query('sortBy')
    .optional()
    .isIn(['weight', 'recordedAt', 'createdAt'])
    .withMessage('Sort by must be one of: weight, recordedAt, createdAt'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),

  query('userId')
    .optional()
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    })
];

export const bulkWeightEntryValidation = [
  body('weightEntryIds')
    .isArray({ min: 1 })
    .withMessage('Weight entry IDs must be a non-empty array')
    .custom((weightEntryIds) => {
      if (!Array.isArray(weightEntryIds)) {
        throw new Error('Weight entry IDs must be an array');
      }
      
      for (const id of weightEntryIds) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid weight entry ID format: ${id}`);
        }
      }
      
      return true;
    }),

  body('action')
    .isIn(['delete'])
    .withMessage('Action must be: delete')
];

export const weightEntryStatsValidation = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'quarter', 'year'])
    .withMessage('Period must be one of: week, month, quarter, year'),

  query('userId')
    .optional()
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    }),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && req.query?.startDate) {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(value);
        
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    })
];
