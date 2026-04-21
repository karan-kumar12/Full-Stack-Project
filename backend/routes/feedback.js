import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { generateFeedback, getFeedback } from '../controllers/feedbackController.js';

// feedback routes
let router = express.Router();

router.post('/:interviewId/generate', authMiddleware, generateFeedback);

router.get('/:feedbackId', authMiddleware, getFeedback);

export default router;