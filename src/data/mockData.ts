// Mock data for Acme Corp Patient Dashboard Backend
// Synchronized with frontend mock data for consistency

import { User, UserModel, WeightEntry, Medication, Shipment, DashboardStats } from '@/types';
import { addDays, format, subDays, subWeeks } from 'date-fns';
import bcrypt from 'bcrypt';

// Demo user credentials
const DEMO_PASSWORD_HASH = bcrypt.hashSync('demo123', 10);

// Mock Users Database
export const mockUsers: UserModel[] = [
  {
    id: 'demo-user-1',
    email: 'patient@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    phone: '(555) 123-4567',
    enrollmentDate: '2024-01-15',
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Medications Database
export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Semaglutide',
    dosage: '1.0 mg',
    frequency: 'Weekly',
    startDate: '2024-01-15',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'med-2',
    name: 'Semaglutide',
    dosage: '0.5 mg',
    frequency: 'Weekly',
    startDate: '2023-12-01',
    endDate: '2024-01-14',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  }
];

// Mock Weight Entries Database
export const mockWeightEntries: WeightEntry[] = [
  { 
    id: 'weight-1', 
    userId: 'demo-user-1', 
    weight: 185, 
    date: '2024-01-15', 
    notes: 'Starting weight - beginning of GLP-1 program',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  { 
    id: 'weight-2', 
    userId: 'demo-user-1', 
    weight: 183, 
    date: '2024-01-29',
    notes: 'Feeling good, no side effects',
    createdAt: '2024-01-29T08:30:00Z',
    updatedAt: '2024-01-29T08:30:00Z'
  },
  { 
    id: 'weight-3', 
    userId: 'demo-user-1', 
    weight: 181, 
    date: '2024-02-12',
    createdAt: '2024-02-12T08:15:00Z',
    updatedAt: '2024-02-12T08:15:00Z'
  },
  { 
    id: 'weight-4', 
    userId: 'demo-user-1', 
    weight: 179, 
    date: '2024-02-26',
    notes: 'Increased appetite control noticed',
    createdAt: '2024-02-26T08:45:00Z',
    updatedAt: '2024-02-26T08:45:00Z'
  },
  { 
    id: 'weight-5', 
    userId: 'demo-user-1', 
    weight: 177, 
    date: '2024-03-11',
    createdAt: '2024-03-11T09:20:00Z',
    updatedAt: '2024-03-11T09:20:00Z'
  },
  { 
    id: 'weight-6', 
    userId: 'demo-user-1', 
    weight: 175, 
    date: '2024-03-25',
    createdAt: '2024-03-25T08:10:00Z',
    updatedAt: '2024-03-25T08:10:00Z'
  },
  { 
    id: 'weight-7', 
    userId: 'demo-user-1', 
    weight: 173, 
    date: '2024-04-08',
    notes: 'Reached 10 pounds lost milestone!',
    createdAt: '2024-04-08T08:35:00Z',
    updatedAt: '2024-04-08T08:35:00Z'
  },
  { 
    id: 'weight-8', 
    userId: 'demo-user-1', 
    weight: 171, 
    date: '2024-04-22',
    createdAt: '2024-04-22T09:00:00Z',
    updatedAt: '2024-04-22T09:00:00Z'
  },
  { 
    id: 'weight-9', 
    userId: 'demo-user-1', 
    weight: 169, 
    date: '2024-05-06',
    createdAt: '2024-05-06T08:25:00Z',
    updatedAt: '2024-05-06T08:25:00Z'
  },
  { 
    id: 'weight-10', 
    userId: 'demo-user-1', 
    weight: 167, 
    date: '2024-05-20',
    notes: 'Feeling more energetic and confident',
    createdAt: '2024-05-20T08:40:00Z',
    updatedAt: '2024-05-20T08:40:00Z'
  },
  { 
    id: 'weight-11', 
    userId: 'demo-user-1', 
    weight: 165, 
    date: '2024-06-03',
    createdAt: '2024-06-03T09:15:00Z',
    updatedAt: '2024-06-03T09:15:00Z'
  },
  { 
    id: 'weight-12', 
    userId: 'demo-user-1', 
    weight: 163, 
    date: '2024-06-17',
    notes: '20 pounds lost! Clothes fitting much better',
    createdAt: '2024-06-17T08:50:00Z',
    updatedAt: '2024-06-17T08:50:00Z'
  },
  { 
    id: 'weight-13', 
    userId: 'demo-user-1', 
    weight: 162, 
    date: '2024-07-01',
    createdAt: '2024-07-01T09:05:00Z',
    updatedAt: '2024-07-01T09:05:00Z'
  }
];

// Mock Shipments Database
export const mockShipments: Shipment[] = [
  {
    id: 'shipment-1',
    userId: 'demo-user-1',
    medication: mockMedications[0]!,
    status: 'delivered',
    orderDate: '2024-01-10',
    shippedDate: '2024-01-12',
    expectedDeliveryDate: '2024-01-15',
    trackingNumber: 'ACM001234567',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'shipment-2',
    userId: 'demo-user-1',
    medication: mockMedications[0]!,
    status: 'delivered',
    orderDate: '2024-02-05',
    shippedDate: '2024-02-07',
    expectedDeliveryDate: '2024-02-10',
    trackingNumber: 'ACM001234568',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-02-10T16:20:00Z'
  },
  {
    id: 'shipment-3',
    userId: 'demo-user-1',
    medication: mockMedications[0]!,
    status: 'delivered',
    orderDate: '2024-03-01',
    shippedDate: '2024-03-03',
    expectedDeliveryDate: '2024-03-06',
    trackingNumber: 'ACM001234569',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    createdAt: '2024-03-01T09:30:00Z',
    updatedAt: '2024-03-06T15:45:00Z'
  },
  {
    id: 'shipment-4',
    userId: 'demo-user-1',
    medication: mockMedications[0]!,
    status: 'delivered',
    orderDate: '2024-04-01',
    shippedDate: '2024-04-03',
    expectedDeliveryDate: '2024-04-06',
    trackingNumber: 'ACM001234570',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    createdAt: '2024-04-01T10:15:00Z',
    updatedAt: '2024-04-06T13:30:00Z'
  },
  {
    id: 'shipment-5',
    userId: 'demo-user-1',
    medication: mockMedications[0]!,
    status: 'delivered',
    orderDate: '2024-05-01',
    shippedDate: '2024-05-03',
    expectedDeliveryDate: '2024-05-06',
    trackingNumber: 'ACM001234571',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    createdAt: '2024-05-01T11:45:00Z',
    updatedAt: '2024-05-06T17:20:00Z'
  },
  {
    id: 'shipment-6',
    userId: 'demo-user-1',
    medication: mockMedications[0]!,
    status: 'delivered',
    orderDate: '2024-06-01',
    shippedDate: '2024-06-03',
    expectedDeliveryDate: '2024-06-06',
    trackingNumber: 'ACM001234572',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    createdAt: '2024-06-01T09:20:00Z',
    updatedAt: '2024-06-06T14:10:00Z'
  },
  {
    id: 'shipment-7',
    userId: 'demo-user-1',
    medication: mockMedications[0]!,
    status: 'shipped',
    orderDate: '2024-07-05',
    shippedDate: '2024-07-07',
    expectedDeliveryDate: '2024-07-10',
    trackingNumber: 'ACM001234573',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    createdAt: '2024-07-05T10:30:00Z',
    updatedAt: '2024-07-07T12:00:00Z'
  }
];

// Calculate dashboard stats dynamically
export const calculateDashboardStats = (userId: string): DashboardStats => {
  const userWeights = mockWeightEntries.filter(entry => entry.userId === userId);
  const userShipments = mockShipments.filter(shipment => shipment.userId === userId);
  
  if (userWeights.length === 0) {
    throw new Error('No weight data found for user');
  }

  // Sort weights by date
  const sortedWeights = userWeights.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const startingWeight = sortedWeights[0]!.weight;
  const currentWeight = sortedWeights[sortedWeights.length - 1]!.weight;
  const targetWeight = 150; // Demo target
  
  const weightLoss = startingWeight - currentWeight;
  const weightLossPercentage = (weightLoss / startingWeight) * 100;
  
  // Calculate BMI (assuming height of 5'6" for demo)
  const heightInMeters = 1.68;
  const currentBMI = currentWeight / (heightInMeters * heightInMeters);
  
  // Calculate days on program
  const enrollmentDate = new Date('2024-01-15');
  const today = new Date();
  const daysOnProgram = Math.floor((today.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Find next shipment
  const nextShipment = userShipments
    .filter(s => s.status === 'shipped' || s.status === 'pending')
    .sort((a, b) => new Date(a.expectedDeliveryDate).getTime() - new Date(b.expectedDeliveryDate).getTime())[0];

  return {
    currentWeight,
    startingWeight,
    targetWeight,
    weightLoss,
    weightLossPercentage: Math.round(weightLossPercentage * 10) / 10,
    currentBMI: Math.round(currentBMI * 10) / 10,
    nextShipmentDate: nextShipment?.expectedDeliveryDate,
    daysOnProgram,
    totalShipments: userShipments.length
  };
};

// Helper functions for data manipulation
export const findUserByEmail = (email: string): UserModel | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  const user = mockUsers.find(user => user.id === id);
  if (!user) return undefined;
  
  // Remove password hash from returned user
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserWeightEntries = (userId: string): WeightEntry[] => {
  return mockWeightEntries
    .filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getUserShipments = (userId: string): Shipment[] => {
  return mockShipments
    .filter(shipment => shipment.userId === userId)
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
};

export const getMedicationById = (id: string): Medication | undefined => {
  return mockMedications.find(med => med.id === id);
};

// Generate unique IDs
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
