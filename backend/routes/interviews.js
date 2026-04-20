import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { startInterview, getInterview, getUserInterviews, completeInterview } from '../controllers/interviewController.js';

// interview routes
let router = express.Router();

router.post('/start', authMiddleware, startInterview);
router.get('/', authMiddleware, getUserInterviews);
router.get('/:interviewId', authMiddleware, getInterview);
router.post('/:interviewId/complete', authMiddleware, completeInterview);

export default router;