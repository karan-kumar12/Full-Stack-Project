import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['technical', 'behavioral', 'situational', 'conceptual', 'mcq'],
    default: 'technical',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  category: {
    type: String,
    default: 'General',
  },
  isMCQ: {
    type: Boolean,
    default: false,
  },
  mcqOptions: [{
    type: String,
  }],
  correctAnswer: {
    type: String,
  },
  expectedKeyPoints: [{
    type: String,
  }],
  timeLimit: {
    type: Number,
    default: 120, // seconds
  },
  position: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('InterviewQuestion', questionSchema);