# Environment Configuration

This directory contains the environment configuration utilities for the Acme Corp Patient Dashboard backend.

## Files

- `env.ts` - Main environment validation and configuration utility
- `index.ts` - Module exports for cleaner imports

## Usage

### Basic Usage

```typescript
import { config } from '@/config';

// Access configuration values
const port = config.server.port;
const mongoUri = config.database.mongodbUri;
const jwtSecret = config.jwt.secret;
```

### Environment Utilities

```typescript
import { isDevelopment, isProduction, isTest } from '@/config';

if (isDevelopment()) {
  console.log('Running in development mode');
}

if (isProduction()) {
  // Production-specific logic
}
```

### Type Safety

The configuration is fully typed, providing IntelliSense and compile-time validation:

```typescript
import { type Config } from '@/config';

function useConfig(config: Config) {
  // Full type safety and autocomplete
  const { port, host } = config.server;
  const { mongodbUri } = config.database;
}
```

## Environment Variables

### Required Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- `SEED_ADMIN_EMAIL` - Admin user email for seeding
- `SEED_ADMIN_PASSWORD` - Admin user password for seeding

### Optional Variables

All other variables have sensible defaults. See `.env.example` for the complete list.

## Validation

The configuration validates all environment variables at boot time using Zod:

- **Type validation** - Ensures correct data types
- **Range validation** - Validates numeric ranges (e.g., port numbers)
- **Format validation** - Validates emails, URLs, etc.
- **Required validation** - Ensures critical variables are present

If validation fails, the application will exit with a detailed error message.

## Environment Files

- `.env.example` - Template file with all available variables
- `.env` - Your local environment variables (not tracked in git)

Copy `.env.example` to `.env` and update the values for your local development environment.
