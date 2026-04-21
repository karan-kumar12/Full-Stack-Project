import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'demo123',
    targetRole: 'Software Engineer',
    bio: 'Aspiring full-stack developer preparing for tech interviews',
    completedInterviews: 3,
    averageScore: 82,
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'demo123',
    targetRole: 'Product Manager',
    bio: 'Preparing for PM interviews at top tech companies',
    completedInterviews: 5,
    averageScore: 78,
  },
  {
    name: 'Mike Chen',
    email: 'mike@example.com',
    password: 'demo123',
    targetRole: 'Data Scientist',
    bio: 'ML engineer looking to transition to data science roles',
    completedInterviews: 2,
    averageScore: 88,
  },
  {
    name: 'Emily Williams',
    email: 'emily@example.com',
    password: 'demo123',
    targetRole: 'Frontend Developer',
    bio: 'React specialist preparing for senior frontend interviews',
    completedInterviews: 7,
    averageScore: 85,
  },
  {
    name: 'Alex Kumar',
    email: 'alex@example.com',
    password: 'demo123',
    targetRole: 'DevOps Engineer',
    bio: 'Cloud infrastructure specialist getting ready for interviews',
    completedInterviews: 4,
    averageScore: 81,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mockmate-ai');
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    // Display login credentials
    console.log('\n📋 Sample Users Created - Use these credentials to login:\n');
    sampleUsers.forEach((user) => {
      console.log(`Email: ${user.email} | Password: demo123 | Role: ${user.targetRole}`);
    });

    console.log('\n✨ Seed data loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();