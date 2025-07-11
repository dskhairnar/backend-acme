import { Request, Response } from 'express';
import { Shipment } from '../models/shipment.model';

export const getAllShipments = async (req: Request, res: Response) => {
  try {
    const shipments = await Shipment.find();
    res.json({ success: true, data: shipments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch shipments' });
  }
};

export const createShipment = async (req: Request, res: Response) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create shipment', message: (error as Error).message });
  }
};

export const updateShipment = async (req: Request, res: Response) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' });
    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update shipment', message: (error as Error).message });
  }
};

export const deleteShipment = async (req: Request, res: Response) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' });
    res.json({ success: true, message: 'Shipment deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to delete shipment', message: (error as Error).message });
  }
}; 