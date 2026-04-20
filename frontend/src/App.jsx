import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './utils/store';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewPage from './pages/InterviewPage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

import './styles/globals.css';

// main app
function App() {
  let token = useAuthStore((state) => state.token);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/auth" element={token ? <Navigate to="/dashboard" /> : <AuthPage />} />
        {token ? (<>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/setup" element={<InterviewSetupPage />} />
          <Route path="/interview/:interviewId" element={<InterviewPage />} />
          <Route path="/feedback/:feedbackId" element={<FeedbackPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;