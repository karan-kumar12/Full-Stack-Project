import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import {
  createUser,
  findUserByEmail,
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

const formatUserResponse = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  targetRole: user.targetRole,
  completedInterviews: user.completedInterviews,
  averageScore: user.averageScore,
});

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// sign up
export const signup = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedEmail = email.toLowerCase();
    let user;

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      user = new User({
        name,
        email: normalizedEmail,
        password,
        targetRole: targetRole || 'Software Engineer',
      });

      await user.save();
    } else {
      ensureMockData();
      const existingUser = findUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      user = createUser(name, normalizedEmail, password, targetRole || 'Software Engineer');
    }

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      message: 'User created',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// log in
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase();
    let user = null;
    let isPasswordValid = false;

    if (isMongoConnected()) {
      user = await User.findOne({ email: normalizedEmail });
      if (user) {
        isPasswordValid = await user.comparePassword(password);
      }
    } else {
      ensureMockData();
      user = findUserByEmail(normalizedEmail);
      if (user) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    const token = generateToken(user._id || user.id);

    res.json({
      message: 'Login ok',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};

export default { signup, login, logout };