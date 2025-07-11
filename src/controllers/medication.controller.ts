import { Response, NextFunction } from 'express';
import { Medication } from '../models/medication.model';
import { AuthenticatedRequest } from '../types';

export const createMedication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const medication = await Medication.create({
      ...req.body,
      userId: req.user?.id,
    });
    res.status(201).json({ success: true, data: medication });
    return;
  } catch (error) {
    next(error);
  }
};

export const getMedications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const medications = await Medication.find({ userId: req.user?.id });
    res.json({ success: true, data: medications });
    return;
  } catch (error) {
    next(error);
  }
};

export const getMedication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const medication = await Medication.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    });
    if (!medication) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }
    res.json({ success: true, data: medication });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateMedication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    if (!medication) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }
    res.json({ success: true, data: medication });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteMedication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id,
    });
    if (!medication) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }
    res.json({ success: true, data: medication });
    return;
  } catch (error) {
    next(error);
  }
};
