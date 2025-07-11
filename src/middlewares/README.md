# Authentication Middleware

This module provides comprehensive authentication and authorization middleware for the Acme Patient Dashboard Backend.

## Features

### JWT Authentication
- **Token Verification**: Verifies JWT tokens from Authorization header
- **User Attachment**: Attaches authenticated user to request object
- **Role Support**: Includes user roles in tokens and request context
- **Token Generation**: Provides access and refresh token generation
- **Error Handling**: Consistent error responses for authentication failures

### Rate Limiting
- **Auth Rate Limiting**: Protects authentication endpoints (5 requests per 15 minutes)
- **API Rate Limiting**: General API protection (100 requests per 15 minutes)
- **Strict Rate Limiting**: For sensitive operations (3 requests per hour)

### Role-Based Access Control
- **Role Enforcement**: Middleware to restrict access based on user roles
- **Admin Access**: Dedicated admin-only middleware
- **Moderator Access**: Admin and moderator access middleware
- **Resource Ownership**: Ensures users can only access their own resources

### Additional Features
- **Optional Authentication**: Middleware that doesn't fail if no token provided
- **API Key Validation**: For webhook endpoints
- **Consistent Error Handling**: Standardized error responses

## Middleware Functions

### Authentication Middleware

#### `authenticateToken`
Verifies JWT token and attaches user to request object.
```typescript
router.get('/protected', authenticateToken, handler);
```

#### `optionalAuth`
Optional authentication that doesn't fail if no token provided.
```typescript
router.get('/public-or-private', optionalAuth, handler);
```

### Rate Limiting Middleware

#### `authRateLimit`
Rate limiting for authentication routes.
```typescript
router.post('/login', authRateLimit, handler);
```

#### `apiRateLimit`
General API rate limiting.
```typescript
app.use(apiRateLimit);
```

#### `strictRateLimit`
Strict rate limiting for sensitive operations.
```typescript
router.post('/sensitive', strictRateLimit, handler);
```

### Role-Based Access Control

#### `requireRole(roles)`
Enforces specific roles.
```typescript
router.get('/admin-only', requireRole('admin'), handler);
router.get('/staff-only', requireRole(['admin', 'moderator']), handler);
```

#### `requireAdmin`
Requires admin role.
```typescript
router.delete('/users/:id', requireAdmin, handler);
```

#### `requireAdminOrModerator`
Requires admin or moderator role.
```typescript
router.put('/users/:id', requireAdminOrModerator, handler);
```

#### `requireOwnership`
Ensures users can only access their own resources (admins have full access).
```typescript
router.get('/users/:id', requireOwnership, handler);
```

### Additional Middleware

#### `validateApiKey`
Validates API keys for webhook endpoints.
```typescript
router.post('/webhook', validateApiKey, handler);
```

## Token Functions

### `generateAccessToken(user)`
Generates JWT access token for a user.

### `generateRefreshToken(user)`
Generates JWT refresh token for a user.

### `verifyRefreshToken(token)`
Verifies and decodes refresh token.

### `getTokenExpiration(expiresIn)`
Gets token expiration time in ISO string format.

## Usage Examples

### Basic Authentication
```typescript
import { authenticateToken } from '../middlewares/auth.middleware';

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

### Role-Based Access
```typescript
import { requireAdmin, requireOwnership } from '../middlewares/auth.middleware';

// Admin only
router.get('/admin/users', requireAdmin, handler);

// Users can only access their own data
router.get('/users/:id/profile', requireOwnership, handler);
```

### Rate Limited Authentication
```typescript
import { authRateLimit } from '../middlewares/auth.middleware';

router.post('/login', authRateLimit, loginHandler);
router.post('/register', authRateLimit, registerHandler);
```

## User Roles

The system supports three user roles:
- **user**: Default role for regular users
- **moderator**: Can moderate content and access some admin functions
- **admin**: Full system access

## Rate Limiting Configuration

- **Auth endpoints**: 5 requests per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP
- **Sensitive operations**: 3 requests per hour per IP

## Error Responses

All middleware functions return consistent error responses with:
- `success: false`
- `error`: Error type
- `message`: Human-readable error message
- `timestamp`: ISO timestamp

## Testing

Test users available in development:
- **Patient**: `patient@example.com` / `demo123` (role: user)
- **Admin**: `admin@example.com` / `demo123` (role: admin)
- **Moderator**: `moderator@example.com` / `demo123` (role: moderator)
