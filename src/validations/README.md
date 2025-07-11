# Validation Schemas

This directory contains comprehensive validation schemas for the Acme Corp Patient Dashboard Backend API using `express-validator`. The validation system provides robust input validation, sanitization, and error handling.

## Overview

The validation system consists of:
- **Validation Schemas**: Predefined validation rules for different endpoints
- **Validation Middleware**: Custom middleware to handle validation errors
- **Type Safety**: TypeScript integration for better development experience

## Architecture

```
src/validations/
├── index.ts                     # Main exports
├── validation.middleware.ts     # Core validation middleware
├── auth.validation.ts           # Authentication validation schemas
├── user.validation.ts           # User profile validation schemas
├── weightEntry.validation.ts    # Weight entry validation schemas
├── medication.validation.ts     # Medication validation schemas
├── shipment.validation.ts       # Shipment validation schemas
└── README.md                    # This file
```

## Core Middleware

### `validate(validations)`
Creates a validation middleware chain that includes error handling:

```typescript
import { validate, loginValidation } from '../validations';

router.post('/login', validate(loginValidation), (req, res) => {
  // Request is validated at this point
});
```

### `handleValidationErrors`
Middleware that processes validation errors and returns formatted error responses:

```typescript
import { handleValidationErrors } from '../validations';

router.post('/endpoint', [...validations, handleValidationErrors], handler);
```

## Validation Schemas

### Authentication (`auth.validation.ts`)

#### `registerValidation`
Validates user registration data:
- Email format and uniqueness
- Password strength (min 8 chars, mixed case, numbers, special chars)
- Password confirmation matching
- Name validation (2-100 chars, letters only)
- Date of birth (age 13-120)
- Optional role validation

```typescript
import { validate, registerValidation } from '../validations';

router.post('/register', validate(registerValidation), registerHandler);
```

#### `loginValidation`
Validates login credentials:
- Email format
- Password presence

```typescript
import { validate, loginValidation } from '../validations';

router.post('/login', validate(loginValidation), loginHandler);
```

#### Other Auth Validations
- `forgotPasswordValidation`: Email validation for password reset
- `resetPasswordValidation`: Token and new password validation
- `changePasswordValidation`: Current and new password validation

### User Profile (`user.validation.ts`)

#### `updateProfileValidation`
Validates profile updates:
- Optional name, email, dob, role fields
- Same validation rules as registration

```typescript
router.put('/profile', validate(updateProfileValidation), updateProfileHandler);
```

#### `userQueryValidation`
Validates user listing queries:
- Pagination (page, limit)
- Search filters
- Sorting options

```typescript
router.get('/users', validate(userQueryValidation), getUsersHandler);
```

### Weight Entries (`weightEntry.validation.ts`)

#### `createWeightEntryValidation`
Validates weight entry creation:
- Weight: 0.1-1000 range
- Recorded date: not in future, not more than 1 year ago
- Optional user ID validation

```typescript
router.post('/weight-entries', validate(createWeightEntryValidation), createHandler);
```

#### `weightEntryQueryValidation`
Validates weight entry queries:
- Date range filtering
- Weight range filtering
- Pagination and sorting

### Medication (`medication.validation.ts`)

#### `createMedicationValidation`
Validates medication creation:
- Name: 2-200 chars, alphanumeric with allowed symbols
- Dosage: 1-100 chars with medical notation
- Frequency: 1-100 chars
- Start date: not in future, not more than 5 years ago
- End date: after start date, max 1 year in future

```typescript
router.post('/medications', validate(createMedicationValidation), createHandler);
```

### Shipment (`shipment.validation.ts`)

#### `createShipmentValidation`
Validates shipment creation:
- Items array: non-empty with name, quantity, optional price
- Item validation: name 2-200 chars, quantity 1-1000, price 0-100000
- Optional status and tracking number

```typescript
router.post('/shipments', validate(createShipmentValidation), createHandler);
```

## Usage Examples

### Basic Usage
```typescript
import { Router } from 'express';
import { validate, createWeightEntryValidation } from '../validations';

const router = Router();

router.post('/weight-entries', 
  validate(createWeightEntryValidation), 
  async (req, res) => {
    // Request body is validated and sanitized
    const { weight, recordedAt } = req.body;
    // ... handle request
  }
);
```

### Custom Validation
```typescript
import { body } from 'express-validator';
import { validate } from '../validations';

const customValidation = [
  body('customField')
    .isLength({ min: 5 })
    .withMessage('Custom field must be at least 5 characters')
];

router.post('/custom', validate(customValidation), handler);
```

### Combining Validations
```typescript
import { validate, userIdValidation } from '../validations';
import { body } from 'express-validator';

const updateUserValidation = [
  ...userIdValidation,
  body('name').optional().isLength({ min: 2 })
];

router.put('/users/:id', validate(updateUserValidation), handler);
```

## Error Response Format

Validation errors are returned in a consistent format:

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Validation failed",
  "data": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long",
      "value": "123"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Best Practices

### 1. Use Appropriate Validation Schema
Choose the most specific validation schema for your endpoint:
```typescript
// Good: Specific validation
router.post('/register', validate(registerValidation), handler);

// Avoid: Generic validation
router.post('/register', validate([body('email').isEmail()]), handler);
```

### 2. Combine with Authentication
Use validation alongside authentication middleware:
```typescript
router.put('/profile', 
  authenticateToken,
  validate(updateProfileValidation), 
  updateProfileHandler
);
```

### 3. Handle Edge Cases
Consider business logic in custom validators:
```typescript
body('endDate').custom((value, { req }) => {
  if (value && req.body.startDate) {
    const start = new Date(req.body.startDate);
    const end = new Date(value);
    if (end <= start) {
      throw new Error('End date must be after start date');
    }
  }
  return true;
})
```

### 4. Sanitize Input
Use built-in sanitization methods:
```typescript
body('email')
  .isEmail()
  .normalizeEmail()
  .toLowerCase()
```

### 5. Provide Clear Error Messages
Use descriptive error messages:
```typescript
body('weight')
  .isFloat({ min: 0.1, max: 1000 })
  .withMessage('Weight must be a number between 0.1 and 1000 kg')
```

## Testing Validation

### Unit Tests
```typescript
import request from 'supertest';
import app from '../app';

describe('POST /auth/login', () => {
  it('should reject invalid email', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'invalid-email', password: 'password' });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });
});
```

### Integration Tests
```typescript
describe('Weight Entry API', () => {
  it('should create weight entry with valid data', async () => {
    const response = await request(app)
      .post('/weight-entries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        weight: 70.5,
        recordedAt: new Date().toISOString()
      });
    
    expect(response.status).toBe(201);
  });
});
```

## Performance Considerations

1. **Validation Order**: Place quick validations first
2. **Custom Validators**: Keep custom validation logic lightweight
3. **Async Validation**: Use sparingly and only when necessary
4. **Caching**: Consider caching validation results for complex rules

## Security Features

1. **Input Sanitization**: Automatic XSS prevention
2. **Length Limits**: Prevent DoS attacks via large payloads
3. **Type Validation**: Prevent type confusion attacks
4. **Pattern Matching**: Whitelist approach for allowed characters
5. **Rate Limiting**: Combined with rate limiting middleware

## Migration Guide

### From Manual Validation
```typescript
// Before
if (!email || !email.includes('@')) {
  return res.status(400).json({ error: 'Invalid email' });
}

// After
router.post('/endpoint', validate([
  body('email').isEmail().withMessage('Invalid email')
]), handler);
```

### Adding New Validations
1. Create validation schema in appropriate file
2. Export from `index.ts`
3. Import and use in route files
4. Add tests for new validation rules

## Troubleshooting

### Common Issues

1. **Validation Not Working**: Ensure middleware is applied before route handler
2. **Custom Validators Not Triggering**: Check async/await usage
3. **Error Format Issues**: Verify `handleValidationErrors` is included
4. **Performance Problems**: Review complex custom validators

### Debug Mode
Enable detailed validation logging:
```typescript
import { validationResult } from 'express-validator';

// In development
if (process.env.NODE_ENV === 'development') {
  const errors = validationResult(req);
  console.log('Validation errors:', errors.array());
}
```
