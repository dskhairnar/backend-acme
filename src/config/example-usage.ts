/**
 * Example usage of the environment configuration
 * This file demonstrates how to use the config in various scenarios
 */

import { config, isDevelopment, isProduction } from './env';

// Example: Server setup
export function setupServer() {
  const { port, host } = config.server;

  console.log(`Starting server on ${host}:${port}`);

  if (isDevelopment()) {
    console.log('🔧 Development mode enabled');
    console.log(
      `📊 Mock data: ${config.demo.enableMockData ? 'enabled' : 'disabled'}`
    );
  }

  if (isProduction()) {
    console.log('🚀 Production mode - all optimizations enabled');
  }
}

// Example: Database connection
export function connectToDatabase() {
  const { mongodbUri } = config.database;

  console.log(`Connecting to database: ${mongodbUri}`);

  // In a real application, you would use this URI with mongoose
  // mongoose.connect(mongodbUri);
}

// Example: JWT configuration
export function setupJWT() {
  const { secret, expiresIn } = config.jwt;

  console.log(`JWT configured with ${secret.length} character secret`);
  console.log(`Token expiration: ${expiresIn}`);

  // In a real application, you would use these values with jsonwebtoken
  // jwt.sign(payload, secret, { expiresIn });
}

// Example: CORS configuration
export function setupCORS() {
  const { origin, allowedOrigins } = config.cors;

  console.log(`CORS origin: ${origin}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);

  // In a real application, you would use these values with the cors middleware
  // app.use(cors({ origin: allowedOrigins }));
}

// Example: Rate limiting configuration
export function setupRateLimit() {
  const { windowMs, maxRequests } = config.rateLimit;

  console.log(
    `Rate limit: ${maxRequests} requests per ${windowMs / 1000} seconds`
  );

  // In a real application, you would use these values with express-rate-limit
  // app.use(rateLimit({ windowMs, max: maxRequests }));
}

// Example: Feature flags
export function checkFeatures() {
  const { features } = config;

  console.log('Feature flags:');
  console.log(`  Weight tracking: ${features.weightTracking ? '✅' : '❌'}`);
  console.log(
    `  Shipment tracking: ${features.shipmentTracking ? '✅' : '❌'}`
  );
  console.log(
    `  Medication management: ${features.medicationManagement ? '✅' : '❌'}`
  );
  console.log(`  Analytics: ${features.analytics ? '✅' : '❌'}`);
}

// Example: Admin user seeding
export function seedAdmin() {
  const { seedEmail, seedPassword } = config.admin;

  console.log(`Admin user will be seeded with email: ${seedEmail}`);

  // In a real application, you would use these values to create an admin user
  // User.create({ email: seedEmail, password: hashedPassword, role: 'admin' });
}

// Run examples if this file is executed directly
if (require.main === module) {
  console.log('🔧 Configuration Examples\n');

  setupServer();
  connectToDatabase();
  setupJWT();
  setupCORS();
  setupRateLimit();
  checkFeatures();
  seedAdmin();
}
