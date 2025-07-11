import { Router } from 'express';
import { 
  register,
  login,
  logout,
  refreshToken,
  getProfile
} from '../controllers/auth.controller';
import {
  authenticateToken
} from '../middlewares/auth.middleware';
import { 
  registerValidation,
  loginValidation,
  validate
} from '../validations';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  register
);

router.post(
  '/login',
  login
);

router.post(
  '/refresh',
  refreshToken
);

router.post('/logout', logout);

router.get('/me', authenticateToken, getProfile);

export default router;
