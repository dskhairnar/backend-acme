import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the environment schema with validation rules
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform(Number)
    .refine(port => port > 0 && port < 65536, {
      message: 'PORT must be a valid port number (1-65535)',
    }),
  HOST: z.string().default('localhost'),

  // Database Configuration
  MONGODB_URI: z
    .string()
    .url('MONGODB_URI must be a valid MongoDB connection string'),

  // JWT Configuration
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // Admin User Configuration
  SEED_ADMIN_EMAIL: z
    .string()
    .email('SEED_ADMIN_EMAIL must be a valid email address'),
  SEED_ADMIN_PASSWORD: z
    .string()
    .min(6, 'SEED_ADMIN_PASSWORD must be at least 6 characters long'),

  // Security Configuration
  BCRYPT_SALT_ROUNDS: z
    .string()
    .transform(Number)
    .refine(rounds => rounds >= 10 && rounds <= 15, {
      message: 'BCRYPT_SALT_ROUNDS must be between 10 and 15',
    })
    .default('12'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform(Number)
    .refine(ms => ms > 0, {
      message: 'RATE_LIMIT_WINDOW_MS must be a positive number',
    })
    .default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform(Number)
    .refine(max => max > 0, {
      message: 'RATE_LIMIT_MAX_REQUESTS must be a positive number',
    })
    .default('100'),

  // CORS Configuration
  CORS_ORIGIN: z.string().default('http://localhost:8080'),
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:8080,http://localhost:5173'),

  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().optional(),

  // API Configuration
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('/api'),

  // Demo/Development Settings
  DEMO_MODE: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  ENABLE_MOCK_DATA: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  // Health Check Configuration
  HEALTH_CHECK_INTERVAL: z
    .string()
    .transform(Number)
    .refine(interval => interval > 0, {
      message: 'HEALTH_CHECK_INTERVAL must be a positive number',
    })
    .default('30000'),

  // Demo User Credentials
  DEMO_EMAIL: z.string().email().optional(),
  DEMO_PASSWORD: z.string().optional(),
  DEMO_USER_ID: z.string().optional(),

  // Feature Flags
  ENABLE_WEIGHT_TRACKING: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
  ENABLE_SHIPMENT_TRACKING: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
  ENABLE_MEDICATION_MANAGEMENT: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
  ENABLE_ANALYTICS: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
});

// Validate environment variables
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment configuration:');
    error.errors.forEach(err => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    console.error(
      '\nPlease check your .env file and ensure all required variables are set correctly.'
    );
    process.exit(1);
  }
  throw error;
}

// Create typed configuration object
export const config = {
  // Server Configuration
  server: {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    host: env.HOST,
  },

  // Database Configuration
  database: {
    mongodbUri: env.MONGODB_URI,
  },

  // JWT Configuration
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  },

  // Admin User Configuration
  admin: {
    seedEmail: env.SEED_ADMIN_EMAIL,
    seedPassword: env.SEED_ADMIN_PASSWORD,
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },

  // CORS Configuration
  cors: {
    origin: env.CORS_ORIGIN,
    allowedOrigins: env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
  },

  // Logging Configuration
  logging: {
    level: env.LOG_LEVEL,
    file: env.LOG_FILE,
  },

  // API Configuration
  api: {
    version: env.API_VERSION,
    prefix: env.API_PREFIX,
  },

  // Demo/Development Settings
  demo: {
    mode: env.DEMO_MODE,
    enableMockData: env.ENABLE_MOCK_DATA,
    credentials: {
      email: env.DEMO_EMAIL,
      password: env.DEMO_PASSWORD,
      userId: env.DEMO_USER_ID,
    },
  },

  // Health Check Configuration
  healthCheck: {
    interval: env.HEALTH_CHECK_INTERVAL,
  },

  // Feature Flags
  features: {
    weightTracking: env.ENABLE_WEIGHT_TRACKING,
    shipmentTracking: env.ENABLE_SHIPMENT_TRACKING,
    medicationManagement: env.ENABLE_MEDICATION_MANAGEMENT,
    analytics: env.ENABLE_ANALYTICS,
  },
} as const;

// Export the configuration type for use in other files
export type Config = typeof config;

// Utility function to check if running in development mode
export const isDevelopment = () => config.server.nodeEnv === 'development';

// Utility function to check if running in production mode
export const isProduction = () => config.server.nodeEnv === 'production';

// Utility function to check if running in test mode
export const isTest = () => config.server.nodeEnv === 'test';

// Log successful configuration load
console.log('✅ Environment configuration loaded successfully');
if (isDevelopment()) {
  console.log(
    `🚀 Server will run on ${config.server.host}:${config.server.port}`
  );
  console.log(`🗄️  Database: ${config.database.mongodbUri}`);
  console.log(`🔧 Demo mode: ${config.demo.mode ? 'enabled' : 'disabled'}`);
}
