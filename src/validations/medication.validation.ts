import { body, param, query } from 'express-validator';
import { Types } from 'mongoose';

export const createMedicationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Medication name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Medication name must be between 2 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-(),.]+$/)
    .withMessage('Medication name can only contain letters, numbers, spaces, hyphens, parentheses, commas, and periods'),

  body('dosage')
    .trim()
    .notEmpty()
    .withMessage('Dosage is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Dosage must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-(),.\/]+$/)
    .withMessage('Dosage can only contain letters, numbers, spaces, hyphens, parentheses, commas, periods, and forward slashes'),

  body('frequency')
    .trim()
    .notEmpty()
    .withMessage('Frequency is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Frequency must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-(),.\/]+$/)
    .withMessage('Frequency can only contain letters, numbers, spaces, hyphens, parentheses, commas, periods, and forward slashes'),

  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date')
    .custom((value) => {
      const startDate = new Date(value);
      const now = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(now.getFullYear() - 5);
      
      if (startDate > now) {
        throw new Error('Start date cannot be in the future');
      }
      
      if (startDate < fiveYearsAgo) {
        throw new Error('Start date cannot be more than 5 years ago');
      }
      
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value) {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        const now = new Date();
        
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
        
        // Allow end date to be up to 1 year in the future for planned medication stops
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);
        
        if (endDate > oneYearFromNow) {
          throw new Error('End date cannot be more than 1 year in the future');
        }
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

export const updateMedicationValidation = [
  param('id')
    .notEmpty()
    .withMessage('Medication ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid medication ID format');
      }
      return true;
    }),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Medication name must be between 2 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-(),.]+$/)
    .withMessage('Medication name can only contain letters, numbers, spaces, hyphens, parentheses, commas, and periods'),

  body('dosage')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Dosage must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-(),.\/]+$/)
    .withMessage('Dosage can only contain letters, numbers, spaces, hyphens, parentheses, commas, periods, and forward slashes'),

  body('frequency')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Frequency must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-(),.\/]+$/)
    .withMessage('Frequency can only contain letters, numbers, spaces, hyphens, parentheses, commas, periods, and forward slashes'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date')
    .custom((value) => {
      const startDate = new Date(value);
      const now = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(now.getFullYear() - 5);
      
      if (startDate > now) {
        throw new Error('Start date cannot be in the future');
      }
      
      if (startDate < fiveYearsAgo) {
        throw new Error('Start date cannot be more than 5 years ago');
      }
      
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value) {
        const endDate = new Date(value);
        const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
        const now = new Date();
        
        if (startDate && endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
        
        // Allow end date to be up to 1 year in the future for planned medication stops
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);
        
        if (endDate > oneYearFromNow) {
          throw new Error('End date cannot be more than 1 year in the future');
        }
      }
      return true;
    })
];

export const medicationIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Medication ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid medication ID format');
      }
      return true;
    })
];

export const medicationQueryValidation = [
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

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),

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

  query('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
    .toBoolean(),

  query('name')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Medication name filter must be less than 200 characters'),

  query('sortBy')
    .optional()
    .isIn(['name', 'dosage', 'frequency', 'startDate', 'endDate', 'createdAt'])
    .withMessage('Sort by must be one of: name, dosage, frequency, startDate, endDate, createdAt'),

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

export const bulkMedicationValidation = [
  body('medicationIds')
    .isArray({ min: 1 })
    .withMessage('Medication IDs must be a non-empty array')
    .custom((medicationIds) => {
      if (!Array.isArray(medicationIds)) {
        throw new Error('Medication IDs must be an array');
      }
      
      for (const id of medicationIds) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid medication ID format: ${id}`);
        }
      }
      
      return true;
    }),

  body('action')
    .isIn(['discontinue', 'delete'])
    .withMessage('Action must be one of: discontinue, delete'),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value) => {
      if (value) {
        const endDate = new Date(value);
        const now = new Date();
        
        if (endDate < now) {
          throw new Error('End date cannot be in the past');
        }
      }
      return true;
    })
];

export const medicationAdherenceValidation = [
  param('id')
    .notEmpty()
    .withMessage('Medication ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid medication ID format');
      }
      return true;
    }),

  body('taken')
    .isBoolean()
    .withMessage('Taken must be a boolean value'),

  body('takenAt')
    .optional()
    .isISO8601()
    .withMessage('Taken date must be a valid ISO 8601 date')
    .custom((value) => {
      if (value) {
        const takenDate = new Date(value);
        const now = new Date();
        
        if (takenDate > now) {
          throw new Error('Taken date cannot be in the future');
        }
      }
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];
