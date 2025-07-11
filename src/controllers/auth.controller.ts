import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import { ApiResponse, AuthResponse, AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError, createApiError } from '../utils/ApiError';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { hashPassword, comparePassword } from '../utils/password';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  getTokenExpiration,
  JwtPayload 
} from '../middleware/auth';
import { config } from '../config';

/**
 * Helper function to transform MongoDB user object to API User type
 */
const transformUserForAPI = (userDoc: any) => {
  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    firstName: userDoc.name.split(' ')[0] || userDoc.name,
    lastName: userDoc.name.split(' ').slice(1).join(' ') || '',
    dateOfBirth: userDoc.dob.toISOString().split('T')[0],
    enrollmentDate: userDoc.createdAt.toISOString().split('T')[0],
    createdAt: userDoc.createdAt.toISOString(),
    updatedAt: userDoc.updatedAt.toISOString(),
    role: userDoc.role
  };
};

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, dob, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createApiError.conflict('User already exists with this email');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = new User({
    email,
    passwordHash,
    name,
    dob: new Date(dob),
    role: role || 'user',
  });

  const savedUser = await user.save();

  // Remove password hash from response
  const userResponse = savedUser.toObject();
  delete (userResponse as any).passwordHash;

  // Transform user for API
  const apiUser = transformUserForAPI(userResponse);

  // Generate tokens
  const accessToken = generateAccessToken(apiUser);
  const refreshToken = generateRefreshToken(apiUser);

  // Create auth response
  const authResponse: AuthResponse = {
    user: apiUser,
    token: accessToken,
    refreshToken,
    expiresIn: getTokenExpiration(config.jwt.expiresIn),
  };

  sendSuccess(res, authResponse, 'User registered successfully', 201);
});

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw createApiError.unauthorized('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createApiError.unauthorized('Invalid credentials');
  }

  // Remove password hash from user object
  const userResponse = user.toObject();
  delete (userResponse as any).passwordHash;

  // Transform user for API
  const apiUser = transformUserForAPI(userResponse);

  // Generate tokens
  const accessToken = generateAccessToken(apiUser);
  const refreshToken = generateRefreshToken(apiUser);

  // Create auth response
  const authResponse: AuthResponse = {
    user: apiUser,
    token: accessToken,
    refreshToken,
    expiresIn: getTokenExpiration(config.jwt.expiresIn),
  };

  sendSuccess(res, authResponse, 'Login successful');
});

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // In a real application, you would:
  // 1. Add the token to a blacklist/revocation list
  // 2. Remove refresh token from database
  // 3. Clear any server-side sessions
  
  sendSuccess(res, null, 'Logged out successfully');
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createApiError.badRequest('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createApiError.unauthorized('User not found');
    }

    // Remove password hash from user object
    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    // Transform user for API
    const apiUser = transformUserForAPI(userResponse);

    // Generate new tokens
    const newAccessToken = generateAccessToken(apiUser);
    const newRefreshToken = generateRefreshToken(apiUser);

    // Create auth response
    const authResponse: AuthResponse = {
      user: apiUser,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: getTokenExpiration(config.jwt.expiresIn),
    };

    sendSuccess(res, authResponse, 'Token refreshed successfully');
  } catch (error) {
    throw createApiError.unauthorized('Invalid or expired refresh token');
  }
});

/**
 * Get current user profile
 * GET /api/v1/auth/me
 */
export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createApiError.unauthorized('User not authenticated');
  }

  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw createApiError.notFound('User not found');
  }

  const apiUser = transformUserForAPI(user.toObject());

  sendSuccess(res, apiUser, 'User profile retrieved successfully');
});
