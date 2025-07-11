import http from 'http';
import app from './app';
import { config } from './config';
import {
  connectDB,
  gracefulShutdown as dbGracefulShutdown,
} from './config/database';

const server = http.createServer(app);

// Start the server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    const port = config.server.port || 3000;
    const host = config.server.host || '0.0.0.0';

    server.listen(port, host, () => {
      console.log(`🚀 Server running on ${host}:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(
        `🔗 API available at: http://${host}:${port}${config.api.prefix}/${config.api.version}`
      );
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  // Set a timeout for forced shutdown
  const forceShutdownTimeout = setTimeout(() => {
    console.error('⏰ Force shutdown after timeout');
    process.exit(1);
  }, 10000);

  try {
    // Close HTTP server
    await new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          reject(err);
        } else {
          console.log('✅ HTTP server closed successfully');
          resolve();
        }
      });
    });

    // Close database connections
    await dbGracefulShutdown();

    // Clear the force shutdown timeout
    clearTimeout(forceShutdownTimeout);

    console.log('🎉 Graceful shutdown completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    clearTimeout(forceShutdownTimeout);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start the server
startServer();

export default server;
