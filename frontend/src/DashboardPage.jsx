import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Plus, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useInterviewStore } from '../utils/store';
import { interviewAPI, userAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { setInterviews } = useInterviewStore();
  const [interviews, setLocalInterviews] = useState([]);
  const [stats, setStats] = useState({
    completedInterviews: 0,
    averageScore: 0,
    targetRole: 'Software Engineer',
  });
  const [loading, setLoading] = useState(true);

  // Update stats whenever user from auth store changes
  useEffect(() => {
    if (user) {
      setStats({
        completedInterviews: user.completedInterviews || 0,
        averageScore: user.averageScore || 0,
        targetRole: user.targetRole || 'Software Engineer',
        memberSince: user.createdAt,
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let interviews = [];
        let derivedStats = null;

        // Fetch interviews
        try {
          let interviewsRes = await interviewAPI.getInterviews();
          interviews = interviewsRes.data.interviews || [];
          setLocalInterviews(interviews);
          setInterviews(interviews);

          const completedInterviews = interviews.filter((item) => item.status === 'completed').length;
          const completedScores = interviews
            .filter((item) => item.status === 'completed')
            .map((item) => Number(item.overallScore || 0));
          const averageScore = completedScores.length
            ? Math.round(completedScores.reduce((sum, val) => sum + val, 0) / completedScores.length)
            : 0;

          derivedStats = {
            completedInterviews,
            averageScore,
            targetRole: user?.targetRole || 'Software Engineer',
            memberSince: user?.createdAt,
          };

          setStats((prev) => ({ ...prev, ...derivedStats }));
        } catch (err) {
          console.error('Failed to fetch interviews:', err);
          setLocalInterviews([]);
        }

        // Fetch user stats to get latest values
        try {
          let statsRes = await userAPI.getStats();
          let apiStats = statsRes.data.stats;
          const mergedStats = {
            completedInterviews:
              apiStats.completedInterviews ?? derivedStats?.completedInterviews ?? 0,
            averageScore: apiStats.averageScore ?? derivedStats?.averageScore ?? 0,
            targetRole: apiStats.targetRole || 'Software Engineer',
            memberSince: apiStats.memberSince,
          };

          setStats(mergedStats);
          if (user) {
            setUser({
              ...user,
              completedInterviews: mergedStats.completedInterviews,
              averageScore: mergedStats.averageScore,
              targetRole: mergedStats.targetRole,
            });
          }
        } catch (err) {
          console.error('Failed to fetch stats:', err);
          if (derivedStats) {
            setStats(derivedStats);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setInterviews, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 bg-opacity-50 backdrop-blur-md border-b border-slate-700"
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">MockMate AI</h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
            >
              <User className="w-5 h-5" />
              Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-300 text-lg">
            Your interview practice journey continues. Let's ace that interview!
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-indigo-600 bg-opacity-80 border border-indigo-400"
          >
            <BarChart3 className="w-8 h-8 text-blue-200 mb-3" />
            <p className="text-blue-100 mb-1 font-medium">Interviews Completed</p>
            <p className="text-4xl font-bold text-white">{stats.completedInterviews}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-purple-600 bg-opacity-80 border border-purple-400"
          >
            <BarChart3 className="w-8 h-8 text-purple-200 mb-3" />
            <p className="text-purple-100 mb-1 font-medium">Average Score</p>
            <p className="text-4xl font-bold text-white">{stats.averageScore}%</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-pink-600 bg-opacity-80 border border-pink-400"
          >
            <BarChart3 className="w-8 h-8 text-pink-200 mb-3" />
            <p className="text-pink-100 mb-1 font-medium">Target Role</p>
            <p className="text-xl font-bold text-white">{stats.targetRole}</p>
          </motion.div>
        </div>

        {/* Start Interview Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/setup')}
          className="mb-12 cursor-pointer"
        >
          <div className="card bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-8 text-center rounded-xl shadow-2xl hover:shadow-indigo-500/50 border border-indigo-500">
            <Plus className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Start New Interview</h3>
            <p className="text-indigo-100">
              Practice a new role-specific interview with AI feedback
            </p>
          </div>
        </motion.div>

        {/* Recent Interviews */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Recent Interviews</h3>
          {interviews.length > 0 ? (
            <div className="grid gap-4">
              {interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/interview/${interview.id}`)}
                  className="card bg-slate-700 border border-slate-600 cursor-pointer hover:bg-slate-600 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {interview.jobRole}
                      </h4>
                      <div className="flex gap-4 text-slate-200">
                        <span className="flex items-center gap-1">
                          Level: {interview.experienceLevel}
                        </span>
                        <span className="flex items-center gap-1">
                          {interview.completedQuestions}/{interview.totalQuestions} Q's
                        </span>
                        <span className="flex items-center gap-1">
                          Score: {interview.overallScore}%
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        interview.status === 'completed'
                          ? 'bg-green-600 text-green-50'
                          : 'bg-blue-600 text-blue-50'
                      }`}
                    >
                      {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mt-4">
                    {formatDate(interview.createdAt)}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card bg-slate-700 border border-slate-600 text-center py-12">
              <p className="text-slate-200 text-lg">
                No interviews yet. Start your first interview to begin!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}