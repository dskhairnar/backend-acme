import { Router } from 'express';
import {
  getWeightEntries,
  createWeightEntry,
  getWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
  getWeightStats,
} from '../controllers/weightEntry.controller';
import {
  createWeightEntryValidation,
  updateWeightEntryValidation,
  weightEntryIdValidation,
  weightEntryQueryValidation,
  weightEntryStatsValidation,
} from '../validations/weightEntry.validation';
import { validate } from '../validations/validation.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getWeightEntries);

router.post('/', createWeightEntry);

router.get('/stats/summary', getWeightStats);

router.get('/:id', getWeightEntry);

router.put('/:id', updateWeightEntry);

router.delete('/:id', deleteWeightEntry);

export default router; 