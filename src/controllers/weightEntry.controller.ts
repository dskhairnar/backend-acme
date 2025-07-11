import { Request, Response } from 'express';
import { WeightEntry, IWeightEntry } from '../models/weightEntry.model';
import { ApiResponse, AuthenticatedRequest } from '../types';
import { Types } from 'mongoose';

export const getWeightEntries = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<IWeightEntry[]>>
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const { page = 1, limit = 50, startDate, endDate, sortBy = 'recordedAt', sortOrder = 'desc' } = req.query;

    // Build query - handle both string IDs (mock data) and ObjectIds (MongoDB)
    const query: any = { userId: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId };
    
    if (startDate || endDate) {
      query.recordedAt = {};
      if (startDate) query.recordedAt.$gte = new Date(startDate as string);
      if (endDate) query.recordedAt.$lte = new Date(endDate as string);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const weightEntries = await WeightEntry.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit as string))
      .lean();

    const total = await WeightEntry.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Weight entries retrieved successfully',
      data: weightEntries,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching weight entries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

export const createWeightEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<IWeightEntry>>
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const { weight, recordedAt, notes } = req.body;

    // Check if weight entry already exists for the same date
    const existingEntry = await WeightEntry.findOne({
      userId: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
      recordedAt: new Date(recordedAt || Date.now()),
    });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: 'Weight entry already exists for this date',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const weightEntry = new WeightEntry({
      userId: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
      weight,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      notes,
    });

    const savedEntry = await weightEntry.save();

    return res.status(201).json({
      success: true,
      message: 'Weight entry created successfully',
      data: savedEntry,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating weight entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

export const getWeightEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<IWeightEntry>>
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid weight entry ID',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const weightEntry = await WeightEntry.findOne({
      _id: new Types.ObjectId(id),
      userId: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
    }).lean();

    if (!weightEntry) {
      return res.status(404).json({
        success: false,
        message: 'Weight entry not found',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Weight entry retrieved successfully',
      data: weightEntry,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching weight entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

export const updateWeightEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<IWeightEntry>>
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { weight, recordedAt, notes } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid weight entry ID',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const weightEntry = await WeightEntry.findOne({
      _id: new Types.ObjectId(id),
      userId: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
    });

    if (!weightEntry) {
      return res.status(404).json({
        success: false,
        message: 'Weight entry not found',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    // Update fields
    if (weight !== undefined) weightEntry.weight = weight;
    if (recordedAt !== undefined) weightEntry.recordedAt = new Date(recordedAt);
    if (notes !== undefined) weightEntry.notes = notes;

    const updatedEntry = await weightEntry.save();

    return res.status(200).json({
      success: true,
      message: 'Weight entry updated successfully',
      data: updatedEntry,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating weight entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

export const deleteWeightEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid weight entry ID',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const weightEntry = await WeightEntry.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
    });

    if (!weightEntry) {
      return res.status(404).json({
        success: false,
        message: 'Weight entry not found',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Weight entry deleted successfully',
      data: null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting weight entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

export const getWeightStats = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<any>>
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const { period = 'month' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const weightEntries = await WeightEntry.find({
      userId: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
      recordedAt: { $gte: startDate },
    }).sort({ recordedAt: 1 }).lean();

    if (weightEntries.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No weight entries found for the specified period',
        data: {
          totalEntries: 0,
          averageWeight: 0,
          weightChange: 0,
          weightChangePercentage: 0,
          entries: [],
        },
        timestamp: new Date().toISOString(),
      });
    }

    const firstEntry = weightEntries[0];
    const lastEntry = weightEntries[weightEntries.length - 1];
    
    if (!firstEntry || !lastEntry) {
      return res.status(500).json({
        success: false,
        message: 'Error processing weight entries',
        data: undefined,
        timestamp: new Date().toISOString(),
      });
    }
    
    const totalWeight = weightEntries.reduce((sum, entry) => sum + entry.weight, 0);
    const averageWeight = totalWeight / weightEntries.length;
    const weightChange = lastEntry.weight - firstEntry.weight;
    const weightChangePercentage = firstEntry.weight > 0 ? (weightChange / firstEntry.weight) * 100 : 0;

    return res.status(200).json({
      success: true,
      message: 'Weight statistics retrieved successfully',
      data: {
        totalEntries: weightEntries.length,
        averageWeight: Math.round(averageWeight * 100) / 100,
        weightChange: Math.round(weightChange * 100) / 100,
        weightChangePercentage: Math.round(weightChangePercentage * 100) / 100,
        firstEntry,
        lastEntry,
        entries: weightEntries,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching weight stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: undefined,
      timestamp: new Date().toISOString(),
    });
  }
}; 