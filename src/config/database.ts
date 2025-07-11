import mongoose from 'mongoose';
import { config, isDevelopment } from './env';

// Connection state tracking
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 5000; // 5 seconds
const RETRY_MULTIPLIER = 2;

// Connection options for mongoose
const connectionOptions: mongoose.ConnectOptions = {
  // Connection timeout
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds

  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,

  // Retry settings
  retryWrites: true,
  retryReads: true,

  // Heartbeat settings
  heartbeatFrequencyMS: 10000,

  // Auto index creation (disable in production)
  autoIndex: isDevelopment(),

  // Auto create collections
  autoCreate: true,
};

/**
 * Connect to MongoDB with automatic retry logic
 */
export const connectDB = async (): Promise<void> => {
  if (isConnecting) {
    console.log('🔄 Database connection already in progress...');
    return;
  }

  if (mongoose.connection.readyState === 1) {
    console.log('✅ Database already connected');
    return;
  }

  isConnecting = true;

  try {
    console.log('🔄 Connecting to MongoDB...');

    await mongoose.connect(config.database.mongodbUri, connectionOptions);

    console.log('✅ MongoDB connected successfully');
    connectionAttempts = 0; // Reset retry counter on successful connection
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);

    connectionAttempts++;

    if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
      const delay =
        RETRY_DELAY * Math.pow(RETRY_MULTIPLIER, connectionAttempts - 1);
      console.log(
        `🔄 Retrying connection in ${delay / 1000} seconds... (Attempt ${connectionAttempts}/${MAX_RETRY_ATTEMPTS})`
      );

      setTimeout(async () => {
        isConnecting = false;
        await connectDB();
      }, delay);
    } else {
      console.error(
        '❌ Max retry attempts reached. Could not connect to MongoDB.'
      );
      console.error(
        '💡 Please check your MongoDB connection string and server status.'
      );
      isConnecting = false;
      throw error;
    }
  } finally {
    // Always reset isConnecting flag after connection attempt
    isConnecting = false;
  }
};

/**
 * Disconnect from MongoDB gracefully
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      console.log('🔄 Disconnecting from MongoDB...');
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
};

/**
 * Get current database connection status
 */
export const getConnectionStatus = (): string => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return (
    states[mongoose.connection.readyState as keyof typeof states] || 'unknown'
  );
};

/**
 * Check if database is connected
 */
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Custom connection event handlers
mongoose.connection.on('connected', () => {
  console.log('🎉 MongoDB connection established successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(
    `🖥️  Host: ${mongoose.connection.host}:${mongoose.connection.port}`
  );

  if (isDevelopment()) {
    console.log('🔧 Development mode: Auto-indexing enabled');
  }
});

mongoose.connection.on('error', error => {
  console.error('❌ MongoDB connection error:', error);

  // Log specific error types for better debugging
  if (error.name === 'MongoNetworkError') {
    console.error(
      '🌐 Network error - check your internet connection and MongoDB server'
    );
  } else if (error.name === 'MongooseServerSelectionError') {
    console.error(
      '🔍 Server selection error - MongoDB server might be down or unreachable'
    );
  } else if (error.name === 'MongoParseError') {
    console.error(
      '📝 Parse error - check your MongoDB connection string format'
    );
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('📱 MongoDB disconnected');

  // Attempt to reconnect if not intentionally disconnected
  if (!isConnecting && connectionAttempts < MAX_RETRY_ATTEMPTS) {
    console.log('🔄 Attempting to reconnect to MongoDB...');
    setTimeout(async () => {
      try {
        await connectDB();
      } catch (error) {
        console.error('❌ Reconnection attempt failed:', error);
      }
    }, RETRY_DELAY);
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully');
  connectionAttempts = 0; // Reset retry counter on successful reconnection
});

// Handle connection interruption
mongoose.connection.on('close', () => {
  console.log('🔐 MongoDB connection closed');
});

// Handle authentication errors
mongoose.connection.on('fullsetup', () => {
  console.log('🔧 MongoDB replica set connection established');
});

// Handle slow queries in development
if (isDevelopment()) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(`🐛 MongoDB Query: ${collectionName}.${method}`, {
      query: JSON.stringify(query),
      doc: doc ? JSON.stringify(doc) : undefined,
    });
  });
}

// Connection health check
export const healthCheck = async (): Promise<{
  status: string;
  details: any;
}> => {
  try {
    const adminDb = mongoose.connection.db?.admin();
    const result = await adminDb?.ping();

    return {
      status: 'healthy',
      details: {
        connectionState: getConnectionStatus(),
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
        ping: result,
        uptime: process.uptime(),
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        connectionState: getConnectionStatus(),
        readyState: mongoose.connection.readyState,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

// Graceful shutdown handler
export const gracefulShutdown = async (): Promise<void> => {
  try {
    console.log('🔄 Closing MongoDB connections...');

    // Close all connections
    await mongoose.disconnect();

    console.log('✅ MongoDB connections closed successfully');
  } catch (error) {
    console.error('❌ Error during MongoDB shutdown:', error);
    throw error;
  }
};

// Export mongoose instance for direct access if needed
export { mongoose };

// Export connection status constants
export const CONNECTION_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
} as const;
