import { Router } from 'express';
import { getAllShipments, createShipment, updateShipment, deleteShipment } from '../controllers/shipment.controller';

const router = Router();

router.get('/', getAllShipments);
router.post('/', createShipment);
router.put('/:id', updateShipment);
router.delete('/:id', deleteShipment);

export default router; 