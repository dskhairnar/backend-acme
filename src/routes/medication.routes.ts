import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createMedication,
  getMedications,
  getMedication,
  updateMedication,
  deleteMedication
} from '../controllers/medication.controller';
import {
  createMedicationValidation,
  updateMedicationValidation,
  medicationIdValidation,
  medicationQueryValidation
} from '../validations/medication.validation';
import { validate } from '../validations/validation.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/', validate(createMedicationValidation), createMedication);
router.get('/', validate(medicationQueryValidation), getMedications);
router.get('/:id', validate(medicationIdValidation), getMedication);
router.put('/:id', validate(updateMedicationValidation), updateMedication);
router.delete('/:id', validate(medicationIdValidation), deleteMedication);

export default router; 