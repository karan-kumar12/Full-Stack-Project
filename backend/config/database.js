import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mockmate-ai';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.warn('Running in demo mode without database persistence. Database features will be disabled.');
  }
};

export default connectDB;
