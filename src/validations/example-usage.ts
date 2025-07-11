import { Router, Request, Response } from 'express';
import { 
  validate,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  createWeightEntryValidation,
  weightEntryQueryValidation,
  createMedicationValidation,
  medicationQueryValidation,
  createShipmentValidation,
  shipmentQueryValidation,
  userIdValidation
} from './index';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// ====================
// AUTHENTICATION ROUTES
// ====================

/**
 * POST /auth/register
 * User registration with comprehensive validation
 */
router.post('/auth/register', 
  validate(registerValidation),
  async (req: Request, res: Response) => {
    try {
      const { email, password, name, dob, role } = req.body;
      
      // At this point, all validation has passed:
      // - Email is valid and normalized
      // - Password meets strength requirements
      // - Name is properly formatted
      // - Date of birth is valid (age 13-120)
      // - Role is valid (if provided)
      
      // Your registration logic here
      console.log('Registration data:', { email, name, dob, role });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { email, name, dob, role }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * POST /auth/login
 * User login with validation
 */
router.post('/auth/login',
  validate(loginValidation),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Email is validated and normalized
      // Password presence is confirmed
      
      // Your login logic here
      console.log('Login attempt:', { email });
      
      res.json({
        success: true,
        message: 'Login successful',
        data: { token: 'mock-jwt-token' }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// ====================
// USER PROFILE ROUTES
// ====================

/**
 * PUT /users/:id
 * Update user profile with validation
 */
router.put('/users/:id',
  authenticateToken,
  validate([...userIdValidation, ...updateProfileValidation]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // User ID is validated as valid MongoDB ObjectId
      // Update data is validated (optional fields)
      
      console.log('Updating user:', id, updateData);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { id, ...updateData }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Profile update failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// ====================
// WEIGHT ENTRY ROUTES
// ====================

/**
 * POST /weight-entries
 * Create weight entry with validation
 */
router.post('/weight-entries',
  authenticateToken,
  validate(createWeightEntryValidation),
  async (req: Request, res: Response) => {
    try {
      const { weight, recordedAt } = req.body;
      
      // Weight is validated (0.1-1000 range)
      // Recorded date is validated (not in future, not too old)
      
      console.log('Creating weight entry:', { weight, recordedAt });
      
      res.status(201).json({
        success: true,
        message: 'Weight entry created successfully',
        data: { weight, recordedAt }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Weight entry creation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * GET /weight-entries
 * Get weight entries with query validation
 */
router.get('/weight-entries',
  authenticateToken,
  validate(weightEntryQueryValidation),
  async (req: Request, res: Response) => {
    try {
      const { page, limit, startDate, endDate, minWeight, maxWeight } = req.query;
      
      // All query parameters are validated:
      // - page and limit are positive integers
      // - dates are valid ISO 8601 format
      // - weight ranges are valid numbers
      
      console.log('Querying weight entries:', { 
        page, limit, startDate, endDate, minWeight, maxWeight 
      });
      
      res.json({
        success: true,
        message: 'Weight entries retrieved successfully',
        data: {
          entries: [],
          pagination: { page, limit, total: 0 }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Weight entry query failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// ====================
// MEDICATION ROUTES
// ====================

/**
 * POST /medications
 * Create medication with validation
 */
router.post('/medications',
  authenticateToken,
  validate(createMedicationValidation),
  async (req: Request, res: Response) => {
    try {
      const { name, dosage, frequency, startDate, endDate } = req.body;
      
      // All medication fields are validated:
      // - name: 2-200 chars, alphanumeric + allowed symbols
      // - dosage: 1-100 chars with medical notation
      // - frequency: 1-100 chars
      // - startDate: not in future, not too old
      // - endDate: after startDate, max 1 year in future
      
      console.log('Creating medication:', { 
        name, dosage, frequency, startDate, endDate 
      });
      
      res.status(201).json({
        success: true,
        message: 'Medication created successfully',
        data: { name, dosage, frequency, startDate, endDate }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Medication creation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * GET /medications
 * Get medications with query validation
 */
router.get('/medications',
  authenticateToken,
  validate(medicationQueryValidation),
  async (req: Request, res: Response) => {
    try {
      const { page, limit, search, active, name } = req.query;
      
      // Query parameters are validated:
      // - pagination parameters
      // - search term length
      // - active boolean
      // - name filter length
      
      console.log('Querying medications:', { 
        page, limit, search, active, name 
      });
      
      res.json({
        success: true,
        message: 'Medications retrieved successfully',
        data: {
          medications: [],
          pagination: { page, limit, total: 0 }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Medication query failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// ====================
// SHIPMENT ROUTES
// ====================

/**
 * POST /shipments
 * Create shipment with validation
 */
router.post('/shipments',
  authenticateToken,
  validate(createShipmentValidation),
  async (req: Request, res: Response) => {
    try {
      const { items, status, trackingNumber } = req.body;
      
      // Shipment data is validated:
      // - items: non-empty array with validated items
      // - each item: name, quantity, optional price
      // - status: valid enum value
      // - trackingNumber: proper format if provided
      
      console.log('Creating shipment:', { 
        items, status, trackingNumber 
      });
      
      res.status(201).json({
        success: true,
        message: 'Shipment created successfully',
        data: { items, status, trackingNumber }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Shipment creation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * GET /shipments
 * Get shipments with query validation
 */
router.get('/shipments',
  authenticateToken,
  validate(shipmentQueryValidation),
  async (req: Request, res: Response) => {
    try {
      const { page, limit, status, trackingNumber } = req.query;
      
      // Query parameters are validated:
      // - pagination parameters
      // - status enum value
      // - tracking number format
      
      console.log('Querying shipments:', { 
        page, limit, status, trackingNumber 
      });
      
      res.json({
        success: true,
        message: 'Shipments retrieved successfully',
        data: {
          shipments: [],
          pagination: { page, limit, total: 0 }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Shipment query failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// ====================
// CUSTOM VALIDATION EXAMPLE
// ====================

/**
 * Example of combining multiple validations
 */
import { body, param } from 'express-validator';

const customValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  body('customField')
    .isLength({ min: 5, max: 100 })
    .withMessage('Custom field must be between 5 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('tags')
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage('Tags must be an array of 1-10 items')
    .custom((tags) => {
      if (tags && tags.some((tag: any) => typeof tag !== 'string' || tag.length > 50)) {
        throw new Error('Each tag must be a string of max 50 characters');
      }
      return true;
    })
];

router.post('/custom/:id',
  authenticateToken,
  validate(customValidation),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { customField, email, tags } = req.body;
      
      console.log('Custom endpoint:', { id, customField, email, tags });
      
      res.json({
        success: true,
        message: 'Custom validation passed',
        data: { id, customField, email, tags }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Custom validation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export default router;

// ====================
// USAGE NOTES
// ====================

/**
 * Key Benefits of This Validation System:
 * 
 * 1. **Consistency**: All endpoints use the same validation pattern
 * 2. **Reusability**: Validation schemas can be reused across routes
 * 3. **Type Safety**: TypeScript integration ensures type correctness
 * 4. **Error Handling**: Centralized error handling with consistent format
 * 5. **Security**: Input sanitization and XSS prevention
 * 6. **Performance**: Validation happens before business logic
 * 7. **Maintainability**: Easy to update validation rules in one place
 * 
 * Usage Pattern:
 * 1. Import required validation schemas
 * 2. Apply validation middleware before route handler
 * 3. Trust that request data is valid in handler
 * 4. Focus on business logic, not validation concerns
 * 
 * Testing Strategy:
 * 1. Test validation schemas independently
 * 2. Test route handlers with valid data
 * 3. Test error responses with invalid data
 * 4. Integration tests for complete request flow
 */
