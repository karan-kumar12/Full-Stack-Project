import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, getUserStats } from '../controllers/userController.js';

// user routes
let router = express.Router();
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/stats', authMiddleware, getUserStats);
export default router;