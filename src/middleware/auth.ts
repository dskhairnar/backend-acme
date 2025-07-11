import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, User } from '../types';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
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
    
    // TODO: Replace with real user lookup from database
    const user = null;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'The user associated with this token no longer exists',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Access token has expired. Please refresh your token or login again',
        timestamp: new Date().toISOString(),
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'The provided access token is invalid',
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('Authentication error:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication failed',
        message: 'An error occurred during authentication',
        timestamp: new Date().toISOString(),
      });
    }
  }
};

export const generateAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'acme-patient-dashboard',
    audience: 'acme-patient-dashboard-frontend',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'acme-patient-dashboard',
    audience: 'acme-patient-dashboard-frontend',
  } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

export const getTokenExpiration = (expiresIn: string): string => {
  const now = new Date();
  const expires = new Date(now.getTime() + parseExpiration(expiresIn));
  return expires.toISOString();
};

const parseExpiration = (expiresIn: string): number => {
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1));
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error(`Invalid expiration format: ${expiresIn}`);
  }
};
