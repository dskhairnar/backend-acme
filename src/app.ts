import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import { authenticateToken } from './middlewares/auth.middleware';
import weightEntryRoutes from './routes/weightEntry.routes';
import shipmentRoutes from './routes/shipment.routes';
import medicationRoutes from './routes/medication.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.server.nodeEnv
  });
});

// API routes
const apiRouter = express.Router();

// Auth routes (public)
apiRouter.use('/auth', authRoutes);

// Weight entry routes (protected)
apiRouter.use('/weight-entries', weightEntryRoutes);

// Medication routes (protected)
apiRouter.use('/medications', medicationRoutes);

// Protected routes would go here
// Example: apiRouter.use('/users', authenticateToken, userRoutes);
// Example: apiRouter.use('/shipments', authenticateToken, shipmentRoutes);

// Mount API router
app.use(`${config.api.prefix}/${config.api.version}`, apiRouter);
app.use('/api/v1/shipments', shipmentRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Acme Corp Patient Dashboard API',
    version: '1.0.0',
    environment: config.server.nodeEnv,
    endpoints: {
      auth: `${config.api.prefix}/${config.api.version}/auth`,
      health: '/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(500).json({
      error: 'Internal server error',
      message: isDevelopment ? err.message : 'Something went wrong',
      ...(isDevelopment && { stack: err.stack }),
    });
  }
);

export default app;
