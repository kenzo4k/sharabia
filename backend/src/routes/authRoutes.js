import express from 'express';
import { login, register, updateProfile, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.put('/profile', protect, updateProfile);
router.get('/me', protect, getMe);

export default router;
