import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import RaiseGrievance from './pages/RaiseGrievance';
import Forum from './pages/Forum';
import Footer from './components/Footer';

// Axios Interceptor to add Token
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Protected Route wrapper
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Allow superadmin to access admin pages if needed, or just strict check
    // For now, strict check.
    return <Navigate to="/" />;
  }

  return children;
};

import { CollegeProvider, useCollege } from './context/CollegeContext';

// ... (Imports remain same)

// Protected Route wrapper (Updated to check college context if needed)
// ... (ProtectedRoute remains same for now)

const AppContent = () => {
  const { college, isSubdomain, loading } = useCollege();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Campus...</div>;
  }

  // If on a subdomain but college not found (404)
  if (isSubdomain && !college) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Campus Not Found</h1>
        <p className="text-slate-500 mb-8">The college you are looking for does not exist.</p>
        <a href="http://localhost:3000" className="text-violet-600 hover:underline">Go to Main Portal</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route 
            path="/student" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/raise-grievance" 
            element={
              <ProtectedRoute role="student">
                <RaiseGrievance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute role="superadmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/forum" element={<Forum />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <CollegeProvider>
        <AppContent />
      </CollegeProvider>
    </Router>
  );
};

export default App;
