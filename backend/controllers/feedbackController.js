import Interview from '../models/Interview.js';
import Response from '../models/Response.js';
import Feedback from '../models/Feedback.js';
import mongoose from 'mongoose';
import {
  createFeedback as createMockFeedback,
  getFeedbackById as getMockFeedbackById,
  getInterviewById,
  initializeSampleData,
  mockDatabase,
} from '../config/mockDb.js';

let mockDataInitialized = false;

const isMongoConnected = () => mongoose.connection.readyState === 1;

const ensureMockData = () => {
  if (!mockDataInitialized && mockDatabase.users.length === 0) {
    initializeSampleData();
    mockDataInitialized = true;
  }
};

const normalizeFeedback = (feedback) => ({
  ...feedback,
  id: feedback.id || feedback._id?.toString(),
});

// make feedback
export const generateFeedback = async (req, res) => {
  try {
    const interviewId = req.params.interviewId;
    const userId = req.userId;

    if (!isMongoConnected()) {
      ensureMockData();

      const interview = getInterviewById(interviewId);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found' });
      }

      if (String(interview.userId) !== String(userId)) {
        return res.status(403).json({ error: 'Not allowed' });
      }

      const feedback = createMockFeedback(interviewId, String(userId));
      return res.json({ feedback: normalizeFeedback(feedback) });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const existingFeedback = await Feedback.findOne({ interviewId, userId });
    if (existingFeedback) {
      return res.json({ feedback: normalizeFeedback(existingFeedback.toObject()) });
    }

    const responses = await Response.find({ interviewId, userId }).populate('questionId');
    const mcqResponses = responses.filter((response) => response.isMCQ);
    const totalScore = responses.length
      ? Math.round(responses.reduce((sum, item) => sum + item.score, 0) / responses.length)
      : 0;

    const strengths = [];
    const weaknesses = [];
    const improvementSuggestions = [];

    if (mcqResponses.length > 0) {
      const correctMcq = mcqResponses.filter((r) => r.isCorrect).length;
      const ratio = correctMcq / mcqResponses.length;
      if (ratio >= 0.7) {
        strengths.push(`Strong MCQ performance (${correctMcq}/${mcqResponses.length})`);
      } else {
        weaknesses.push(`Review MCQ answers (${correctMcq}/${mcqResponses.length})`);
      }
    }

    if (responses.length === 0) {
      weaknesses.push('No responses submitted yet. Submit answers to generate better feedback.');
    } else {
      strengths.push('You completed the interview and created a response history.');
    }

    responses.forEach((response) => {
      if (response.isMCQ && response.isCorrect === false && response.questionId) {
        improvementSuggestions.push({
          questionId: response.questionId._id,
          suggestion: `Review the correct answer for: ${response.questionId.questionText}`,
          priority: 'Medium',
        });
      }
    });

    const feedback = await Feedback.create({
      interviewId,
      userId,
      improvementSuggestions,
      strengths,
      weaknesses,
      overallAnalysis: `Your interview performance scored ${totalScore} out of 100. Check areas where you can improve and keep practicing.`,
      nextSteps: [
        totalScore >= 70
          ? 'Continue practicing with a mix of MCQ and open-ended questions.'
          : 'Review fundamentals and retake this interview after more practice.',
      ],
      communicationScore: totalScore,
      technicalScore: totalScore,
      behavioralScore: totalScore,
      overallScore: totalScore,
    });

    res.json({ feedback: normalizeFeedback(feedback.toObject()) });
  } catch (error) {
    console.error('Generate feedback error:', error.message);
    res.status(500).json({ error: 'Error' });
  }
};

// get the feedback
export const getFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;

    if (!isMongoConnected()) {
      ensureMockData();
      const feedback = getMockFeedbackById(feedbackId);
      if (!feedback) return res.status(404).json({ error: 'Not found' });
      if (String(feedback.userId) !== String(req.userId)) {
        return res.status(403).json({ error: 'Not allowed' });
      }
      return res.json({ feedback: normalizeFeedback(feedback) });
    }

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ error: 'Not found' });
    if (feedback.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    res.json({ feedback: normalizeFeedback(feedback.toObject()) });
  } catch (error) {
    console.error('Get feedback error:', error.message);
    res.status(500).json({ error: 'Error' });
  }
};

export default { generateFeedback, getFeedback };