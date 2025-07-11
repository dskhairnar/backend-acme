import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, User as UserType } from '../types';
import { config } from '../config';
import { User } from '../models/user.model';

export interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'Please provide a valid access token in the Authorization header',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    // Find the user by ID using MongoDB
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'The user associated with this token no longer exists',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Attach minimal user to request object
    req.user = {
      id: String(user._id),
      email: user.email,
      role: user.role || (decoded.role as 'admin' | 'user' | 'moderator') || 'user',
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
    };
    
    next();
  } catch (error) {
    handleAuthError(error, res);
  }
};

const handleAuthError = (error: any, res: Response): void => {
  if (error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      message: 'The provided token is invalid or malformed',
      timestamp: new Date().toISOString(),
    });
  } else if (error instanceof jwt.TokenExpiredError) {
    res.status(401).json({
      success: false,
      error: 'Token expired',
      message: 'The provided token has expired',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'An error occurred during authentication',
      timestamp: new Date().toISOString(),
    });
  }
};
