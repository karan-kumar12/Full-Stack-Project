import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { submitResponse } from '../controllers/responseController.js';

// question routes
let router = express.Router();
router.post('/submit', authMiddleware, submitResponse);
export default router;