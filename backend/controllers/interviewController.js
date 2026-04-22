import Interview from '../models/Interview.js';
import InterviewQuestion from '../models/Question.js';
import Response from '../models/Response.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import {
  completeInterview as completeMockInterview,
  createInterview as createMockInterview,
  createQuestion as createMockQuestion,
  findUserById,
  getInterviewById,
  getInterviewQuestions,
  getInterviewResponses,
  getMCQquestionsByLevel,
  getUserInterviews as getMockUserInterviews,
  initializeSampleData,
  mockDatabase,
  updateUser,
} from '../config/mockDb.js';

let mockDataInitialized = false;

const isMongoConnected = () => mongoose.connection.readyState === 1;

const ensureMockData = () => {
  if (!mockDataInitialized && mockDatabase.users.length === 0) {
    initializeSampleData();
    mockDataInitialized = true;
  }
};

const normalizeQuestion = (question) => ({
  ...question,
  id: question.id || question._id?.toString(),
});

const normalizeInterview = (interview, questions = []) => ({
  ...interview,
  id: interview.id || interview._id?.toString(),
  questions: questions.map(normalizeQuestion),
});

// questions for interviews - Section 1: Traditional questions
const DEFAULT_QUESTIONS = [
  'Tell me about your experience with this role',
  'What are your strongest technical skills?',
  'Describe a challenging project you worked on',
  'Where do you see yourself in 5 years?',
  'Why are you interested in this position?',
];

const createInterviewQuestions = async (interviewId, totalQuestions, experienceLevel) => {
  const sectionSize = Math.ceil(totalQuestions / 2);
  const questions = [];

  for (let i = 0; i < Math.min(sectionSize, DEFAULT_QUESTIONS.length); i++) {
    const question = await InterviewQuestion.create({
      interviewId,
      questionText: DEFAULT_QUESTIONS[i],
      questionType: 'technical',
      isMCQ: false,
      position: questions.length + 1,
    });
    questions.push(question);
  }

  const mcqItems = getMCQquestionsByLevel(experienceLevel, totalQuestions - questions.length);
  for (const item of mcqItems) {
    const mcqQuestion = await InterviewQuestion.create({
      interviewId,
      questionText: item.questionText,
      questionType: 'mcq',
      difficulty: item.difficulty,
      isMCQ: true,
      mcqOptions: item.options,
      correctAnswer: item.correctAnswer,
      timeLimit: item.timeLimit,
      position: questions.length + 1,
    });
    questions.push(mcqQuestion);
  }

  return questions;
};

const createMockInterviewQuestions = (interviewId, totalQuestions, experienceLevel) => {
  const sectionSize = Math.ceil(totalQuestions / 2);
  const questions = [];

  for (let i = 0; i < Math.min(sectionSize, DEFAULT_QUESTIONS.length); i++) {
    const question = createMockQuestion(interviewId, DEFAULT_QUESTIONS[i], 'technical');
    questions.push(question);
  }

  const mcqItems = getMCQquestionsByLevel(experienceLevel, totalQuestions - questions.length);
  for (const item of mcqItems) {
    const question = createMockQuestion(interviewId, item.questionText, 'mcq', {
      difficulty: item.difficulty,
      options: item.options,
      correctAnswer: item.correctAnswer,
      timeLimit: item.timeLimit,
    });
    questions.push(question);
  }

  return questions;
};

// start a new interview
export const startInterview = async (req, res) => {
  try {
    const jobRole = req.body.jobRole;
    const experienceLevel = req.body.experienceLevel;
    const duration = req.body.duration || 30;
    const totalQuestions = req.body.totalQuestions || 5;
    const userId = req.userId;

    if (isMongoConnected()) {
      const interview = await Interview.create({
        userId,
        jobRole,
        experienceLevel,
        duration,
        totalQuestions,
        status: 'ongoing',
      });

      const questions = await createInterviewQuestions(interview._id, totalQuestions, experienceLevel);
      interview.questions = questions.map((question) => question._id);
      await interview.save();

      return res.json({ interview: normalizeInterview(interview.toObject(), questions.map((q) => q.toObject())) });
    }

    ensureMockData();
    const interview = createMockInterview(
      userId,
      jobRole,
      experienceLevel,
      Number(duration),
      Number(totalQuestions)
    );
    const questions = createMockInterviewQuestions(interview.id, Number(totalQuestions), experienceLevel);
    interview.questions = questions.map((question) => question.id);

    return res.json({ interview: normalizeInterview(interview, questions) });
  } catch (error) {
    console.error('Start interview error:', error.message);
    res.status(500).json({ error: 'Failed to start interview' });
  }
};

// get an interview
export const getInterview = async (req, res) => {
  try {
    const interviewId = req.params.interviewId;
    const userId = req.userId;

    if (isMongoConnected()) {
      const interview = await Interview.findById(interviewId).populate('questions');
      if (!interview) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (interview.userId.toString() !== userId) {
        return res.status(403).json({ error: 'Not allowed' });
      }

      return res.json({
        interview: normalizeInterview(
          interview.toObject(),
          interview.questions.map((q) => q.toObject())
        ),
      });
    }

    ensureMockData();
    const interview = getInterviewById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (String(interview.userId) !== String(userId)) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const questions = getInterviewQuestions(interview.id);
    return res.json({ interview: normalizeInterview(interview, questions) });
  } catch (error) {
    console.error('Get interview error:', error.message);
    res.status(500).json({ error: 'Error' });
  }
};

// get interviews for user
export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.userId;

    if (isMongoConnected()) {
      const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });

      const enrichedInterviews = await Promise.all(
        interviews.map(async (interview) => {
          const responses = await Response.find({ interviewId: interview._id });
          const overallScore = responses.length
            ? Math.round(responses.reduce((a, b) => a + b.score, 0) / responses.length)
            : interview.overallScore || 0;

          return {
            ...normalizeInterview(interview.toObject()),
            completedQuestions: responses.length,
            overallScore,
          };
        })
      );

      return res.json({ interviews: enrichedInterviews });
    }

    ensureMockData();
    const interviews = getMockUserInterviews(userId)
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const enrichedInterviews = interviews.map((interview) => {
      const responses = getInterviewResponses(interview.id);
      const overallScore = responses.length
        ? Math.round(responses.reduce((sum, item) => sum + item.score, 0) / responses.length)
        : interview.overallScore || 0;

      return {
        ...normalizeInterview(interview),
        completedQuestions: responses.length,
        overallScore,
      };
    });

    return res.json({ interviews: enrichedInterviews });
  } catch (error) {
    console.error('Get user interviews error:', error.message);
    res.status(500).json({ error: 'Error' });
  }
};

// finish an interview
export const completeInterview = async (req, res) => {
  try {
    const interviewId = req.params.interviewId;
    const userId = req.userId;

    if (isMongoConnected()) {
      const interview = await Interview.findById(interviewId);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found' });
      }

      if (interview.userId.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const responses = await Response.find({ interviewId: interview._id });
      const totalScore = responses.length
        ? Math.round(responses.reduce((a, b) => a + b.score, 0) / responses.length)
        : 0;

      interview.status = 'completed';
      interview.completedAt = new Date();
      interview.overallScore = totalScore;
      await interview.save();

      const user = await User.findById(userId);
      if (user) {
        const completedCount = user.completedInterviews + 1;
        const newAverageScore = Math.round(
          (user.averageScore * user.completedInterviews + totalScore) / completedCount
        );

        user.targetRole = interview.jobRole;
        user.completedInterviews = completedCount;
        user.averageScore = newAverageScore;
        await user.save();

        return res.json({
          message: 'Interview completed and stats updated',
          interview: normalizeInterview(interview.toObject()),
          user: user.toJSON(),
        });
      }

      return res.json({
        message: 'Interview completed',
        interview: normalizeInterview(interview.toObject()),
      });
    }

    ensureMockData();
    const interview = getInterviewById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (String(interview.userId) !== String(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const responses = getInterviewResponses(interview.id);
    const totalScore = responses.length
      ? Math.round(responses.reduce((sum, item) => sum + item.score, 0) / responses.length)
      : 0;

    const completed = completeMockInterview(interview.id);
    completed.overallScore = totalScore;

    const user = findUserById(String(userId));
    if (user) {
      const completedCount = user.completedInterviews + 1;
      const newAverageScore = Math.round(
        (user.averageScore * user.completedInterviews + totalScore) / completedCount
      );

      const updatedUser = updateUser(String(userId), {
        targetRole: completed.jobRole,
        completedInterviews: completedCount,
        averageScore: newAverageScore,
      });

      return res.json({
        message: 'Interview completed and stats updated',
        interview: normalizeInterview(completed),
        user: updatedUser,
      });
    }

    return res.json({
      message: 'Interview completed',
      interview: normalizeInterview(completed),
    });
  } catch (error) {
    console.error('Complete interview error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export default { startInterview, getInterview, getUserInterviews, completeInterview };