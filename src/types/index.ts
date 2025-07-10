// Type definitions for Acme Corp Patient Dashboard Backend
// Matches frontend types for consistency

import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  enrollmentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Shipment {
  id: string;
  userId: string;
  medication: Medication;
  status: 'pending' | 'shipped' | 'delivered' | 'delayed';
  orderDate: string;
  shippedDate?: string;
  expectedDeliveryDate: string;
  trackingNumber?: string;
  quantity: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  currentWeight: number;
  startingWeight: number;
  targetWeight?: number;
  weightLoss: number;
  weightLossPercentage: number;
  currentBMI: number;
  nextShipmentDate?: string;
  daysOnProgram: number;
  totalShipments: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateWeightEntryRequest {
  weight: number;
  date: string;
  notes?: string;
}

export interface UpdateWeightEntryRequest {
  weight?: number;
  date?: string;
  notes?: string;
}

export interface CreateShipmentRequest {
  medicationId: string;
  expectedDeliveryDate: string;
  quantity: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface UpdateShipmentRequest {
  status?: 'pending' | 'shipped' | 'delivered' | 'delayed';
  shippedDate?: string;
  expectedDeliveryDate?: string;
  trackingNumber?: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

// Database Models (In-memory for demo)
export interface UserModel extends User {
  passwordHash: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Middleware Types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    api: 'healthy' | 'unhealthy';
    auth: 'healthy' | 'unhealthy';
    data: 'healthy' | 'unhealthy';
  };
}

// Pagination Types
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Analytics Types
export interface WeightProgressAnalytics {
  totalWeightLoss: number;
  weightLossPercentage: number;
  averageWeightLossPerWeek: number;
  bmiReduction: number;
  progressTowardsGoal: number;
  trend: 'improving' | 'stable' | 'concerning';
}

export interface ShipmentAnalytics {
  totalShipments: number;
  onTimeDeliveryRate: number;
  averageDeliveryTime: number;
  upcomingShipments: number;
  shipmentStatusBreakdown: {
    pending: number;
    shipped: number;
    delivered: number;
    delayed: number;
  };
}
