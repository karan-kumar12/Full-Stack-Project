import User from '../models/User.js';
import mongoose from 'mongoose';
import {
  findUserById,
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

const formatUser = (user) => ({
  id: user._id?.toString() || user.id,
  name: user.name,
  email: user.email,
  targetRole: user.targetRole,
  completedInterviews: user.completedInterviews,
  averageScore: user.averageScore,
  profileImage: user.profileImage || null,
  bio: user.bio || '',
  createdAt: user.createdAt,
});

// get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (isMongoConnected()) {
      const user = await User.findById(userId).select('-password');
      if (!user) return res.status(404).json({ error: 'Not found' });
      return res.json({ user: formatUser(user.toObject()) });
    }

    ensureMockData();
    const user = findUserById(String(userId));
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.json({ user: formatUser(user) });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Error' });
  }
};

// update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio, targetRole } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (targetRole !== undefined) updates.targetRole = targetRole;

    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
        context: 'query',
      }).select('-password');

      return res.json({ user: formatUser(user.toObject()) });
    }

    ensureMockData();
    const user = updateUser(String(userId), updates);
    if (!user) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.json({ user: formatUser(user) });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ error: 'Error' });
  }
};

// get stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.userId;

    if (isMongoConnected()) {
      const user = await User.findById(userId).select('completedInterviews averageScore targetRole createdAt');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({
        stats: {
          completedInterviews: user.completedInterviews,
          averageScore: user.averageScore,
          targetRole: user.targetRole,
          memberSince: user.createdAt,
        },
      });
    }

    ensureMockData();
    const user = findUserById(String(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      stats: {
        completedInterviews: user.completedInterviews || 0,
        averageScore: user.averageScore || 0,
        targetRole: user.targetRole || 'Software Engineer',
        memberSince: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export default { getUserProfile, updateUserProfile, getUserStats };