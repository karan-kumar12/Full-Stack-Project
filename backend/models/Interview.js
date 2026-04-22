import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
    examples: ['Software Engineer', 'Data Scientist', 'Frontend Developer', 'DevOps Engineer'],
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid-level', 'Senior'],
    required: true,
  },
  duration: {
    type: Number,
    default: 30, // minutes
  },
  totalQuestions: {
    type: Number,
    default: 5,
  },
  completedQuestions: {
    type: Number,
    default: 0,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewQuestion',
  }],
  responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
  }],
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'paused'],
    default: 'ongoing',
  },
  overallScore: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Interview', interviewSchema);
