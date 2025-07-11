import { body, param, query } from 'express-validator';
import { Types } from 'mongoose';

export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase()
    .isLength({ min: 5, max: 255 })
    .withMessage('Email must be between 5 and 255 characters'),

  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date in ISO 8601 format')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 13) {
        throw new Error('User must be at least 13 years old');
      }
      
      if (age > 120) {
        throw new Error('Invalid date of birth');
      }
      
      return true;
    }),

  body('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be one of: admin, user, moderator')
];

export const userIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    })
];

export const userQueryValidation = [
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

  query('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be one of: admin, user, moderator'),

  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'dob', 'role', 'createdAt', 'updatedAt'])
    .withMessage('Sort by must be one of: name, email, dob, role, createdAt, updatedAt'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
];

export const bulkUserValidation = [
  body('userIds')
    .isArray({ min: 1 })
    .withMessage('User IDs must be a non-empty array')
    .custom((userIds) => {
      if (!Array.isArray(userIds)) {
        throw new Error('User IDs must be an array');
      }
      
      for (const id of userIds) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid user ID format: ${id}`);
        }
      }
      
      return true;
    }),

  body('action')
    .isIn(['activate', 'deactivate', 'delete'])
    .withMessage('Action must be one of: activate, deactivate, delete')
];

export const updateUserRoleValidation = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    }),

  body('role')
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be one of: admin, user, moderator')
];

export const deleteUserValidation = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    }),

  body('confirmPassword')
    .optional()
    .notEmpty()
    .withMessage('Password confirmation is required for account deletion'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Deletion reason must be less than 500 characters')
];
