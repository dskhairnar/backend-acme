import { body, param, query } from 'express-validator';
import { Types } from 'mongoose';

export const createShipmentValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array')
    .custom((items) => {
      if (!Array.isArray(items)) {
        throw new Error('Items must be an array');
      }
      
      for (const [index, item] of items.entries()) {
        if (!item.name || typeof item.name !== 'string') {
          throw new Error(`Item ${index + 1}: Name is required and must be a string`);
        }
        
        if (item.name.trim().length < 2 || item.name.trim().length > 200) {
          throw new Error(`Item ${index + 1}: Name must be between 2 and 200 characters`);
        }
        
        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
          throw new Error(`Item ${index + 1}: Quantity is required and must be a positive number`);
        }
        
        if (item.quantity > 1000) {
          throw new Error(`Item ${index + 1}: Quantity cannot exceed 1000`);
        }
        
        if (item.price !== undefined && (typeof item.price !== 'number' || item.price < 0)) {
          throw new Error(`Item ${index + 1}: Price must be a non-negative number`);
        }
        
        if (item.price !== undefined && item.price > 100000) {
          throw new Error(`Item ${index + 1}: Price cannot exceed 100000`);
        }
      }
      
      return true;
    }),

  body('items.*.name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Item name must be between 2 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-(),.&]+$/)
    .withMessage('Item name can only contain letters, numbers, spaces, hyphens, parentheses, commas, periods, and ampersands'),

  body('items.*.quantity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Item quantity must be between 1 and 1000')
    .toInt(),

  body('items.*.price')
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Item price must be between 0 and 100000')
    .toFloat(),

  body('status')
    .optional()
    .isIn(['pending', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Status must be one of: pending, shipped, delivered, cancelled'),

  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters')
    .matches(/^[a-zA-Z0-9\-]+$/)
    .withMessage('Tracking number can only contain letters, numbers, and hyphens'),

  body('userId')
    .optional()
    .custom((value) => {
      if (value && !Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    })
];

export const updateShipmentValidation = [
  param('id')
    .notEmpty()
    .withMessage('Shipment ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid shipment ID format');
      }
      return true;
    }),

  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array')
    .custom((items) => {
      if (!Array.isArray(items)) {
        throw new Error('Items must be an array');
      }
      
      for (const [index, item] of items.entries()) {
        if (!item.name || typeof item.name !== 'string') {
          throw new Error(`Item ${index + 1}: Name is required and must be a string`);
        }
        
        if (item.name.trim().length < 2 || item.name.trim().length > 200) {
          throw new Error(`Item ${index + 1}: Name must be between 2 and 200 characters`);
        }
        
        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
          throw new Error(`Item ${index + 1}: Quantity is required and must be a positive number`);
        }
        
        if (item.quantity > 1000) {
          throw new Error(`Item ${index + 1}: Quantity cannot exceed 1000`);
        }
        
        if (item.price !== undefined && (typeof item.price !== 'number' || item.price < 0)) {
          throw new Error(`Item ${index + 1}: Price must be a non-negative number`);
        }
        
        if (item.price !== undefined && item.price > 100000) {
          throw new Error(`Item ${index + 1}: Price cannot exceed 100000`);
        }
      }
      
      return true;
    }),

  body('status')
    .optional()
    .isIn(['pending', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Status must be one of: pending, shipped, delivered, cancelled'),

  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters')
    .matches(/^[a-zA-Z0-9\-]+$/)
    .withMessage('Tracking number can only contain letters, numbers, and hyphens'),

  body('shippedAt')
    .optional()
    .isISO8601()
    .withMessage('Shipped date must be a valid ISO 8601 date')
    .custom((value) => {
      if (value) {
        const shippedDate = new Date(value);
        const now = new Date();
        
        if (shippedDate > now) {
          throw new Error('Shipped date cannot be in the future');
        }
      }
      return true;
    }),

  body('deliveredAt')
    .optional()
    .isISO8601()
    .withMessage('Delivered date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value) {
        const deliveredDate = new Date(value);
        const now = new Date();
        
        if (deliveredDate > now) {
          throw new Error('Delivered date cannot be in the future');
        }
        
        if (req.body.shippedAt) {
          const shippedDate = new Date(req.body.shippedAt);
          if (deliveredDate < shippedDate) {
            throw new Error('Delivered date cannot be before shipped date');
          }
        }
      }
      return true;
    })
];

export const shipmentIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Shipment ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid shipment ID format');
      }
      return true;
    })
];

export const trackingNumberValidation = [
  param('trackingNumber')
    .notEmpty()
    .withMessage('Tracking number is required')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters')
    .matches(/^[a-zA-Z0-9\-]+$/)
    .withMessage('Tracking number can only contain letters, numbers, and hyphens')
];

export const shipmentQueryValidation = [
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

  query('status')
    .optional()
    .isIn(['pending', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Status must be one of: pending, shipped, delivered, cancelled'),

  query('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters')
    .matches(/^[a-zA-Z0-9\-]+$/)
    .withMessage('Tracking number can only contain letters, numbers, and hyphens'),

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

  query('itemName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Item name filter must be less than 200 characters'),

  query('sortBy')
    .optional()
    .isIn(['status', 'trackingNumber', 'shippedAt', 'deliveredAt', 'createdAt'])
    .withMessage('Sort by must be one of: status, trackingNumber, shippedAt, deliveredAt, createdAt'),

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

export const bulkShipmentValidation = [
  body('shipmentIds')
    .isArray({ min: 1 })
    .withMessage('Shipment IDs must be a non-empty array')
    .custom((shipmentIds) => {
      if (!Array.isArray(shipmentIds)) {
        throw new Error('Shipment IDs must be an array');
      }
      
      for (const id of shipmentIds) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid shipment ID format: ${id}`);
        }
      }
      
      return true;
    }),

  body('action')
    .isIn(['cancel', 'ship', 'deliver'])
    .withMessage('Action must be one of: cancel, ship, deliver'),

  body('trackingNumbers')
    .optional()
    .isArray()
    .withMessage('Tracking numbers must be an array')
    .custom((trackingNumbers, { req }) => {
      if (req.body.action === 'ship' && (!trackingNumbers || trackingNumbers.length === 0)) {
        throw new Error('Tracking numbers are required when shipping');
      }
      
      if (trackingNumbers && Array.isArray(trackingNumbers)) {
        for (const trackingNumber of trackingNumbers) {
          if (typeof trackingNumber !== 'string' || trackingNumber.trim().length < 5 || trackingNumber.trim().length > 50) {
            throw new Error('Each tracking number must be between 5 and 50 characters');
          }
        }
      }
      
      return true;
    }),

  body('shippedAt')
    .optional()
    .isISO8601()
    .withMessage('Shipped date must be a valid ISO 8601 date')
    .custom((value) => {
      if (value) {
        const shippedDate = new Date(value);
        const now = new Date();
        
        if (shippedDate > now) {
          throw new Error('Shipped date cannot be in the future');
        }
      }
      return true;
    }),

  body('deliveredAt')
    .optional()
    .isISO8601()
    .withMessage('Delivered date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value) {
        const deliveredDate = new Date(value);
        const now = new Date();
        
        if (deliveredDate > now) {
          throw new Error('Delivered date cannot be in the future');
        }
        
        if (req.body.shippedAt) {
          const shippedDate = new Date(req.body.shippedAt);
          if (deliveredDate < shippedDate) {
            throw new Error('Delivered date cannot be before shipped date');
          }
        }
      }
      return true;
    })
];

export const updateShipmentStatusValidation = [
  param('id')
    .notEmpty()
    .withMessage('Shipment ID is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid shipment ID format');
      }
      return true;
    }),

  body('status')
    .isIn(['pending', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Status must be one of: pending, shipped, delivered, cancelled'),

  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters')
    .matches(/^[a-zA-Z0-9\-]+$/)
    .withMessage('Tracking number can only contain letters, numbers, and hyphens'),

  body('statusDate')
    .optional()
    .isISO8601()
    .withMessage('Status date must be a valid ISO 8601 date')
    .custom((value) => {
      if (value) {
        const statusDate = new Date(value);
        const now = new Date();
        
        if (statusDate > now) {
          throw new Error('Status date cannot be in the future');
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
