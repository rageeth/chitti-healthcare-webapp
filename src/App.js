import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProviderRegistration from './components/ProviderRegistration';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import AvailabilityManagement from './components/AvailabilityManagement';
import SuperAdmin from './components/SuperAdmin';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('healthcareToken');
  const userEmail = localStorage.getItem('userEmail');
  
  console.log('🔒 Protected Route Check:', { 
    hasToken: !!token, 
    userEmail, 
    path: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  if (!token) {
    console.log('❌ No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Token found, allowing access');
  return children;
};

// Super Admin Route Component
const SuperAdminRoute = ({ children }) => {
  const superAdminToken = localStorage.getItem('superAdminToken');
  
  console.log('👑 Super Admin Route Check:', { 
    hasSuperAdminToken: !!superAdminToken,
    path: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  if (!superAdminToken) {
    console.log('❌ No super admin token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Super admin token found, allowing access');
  return children;
};

function App() {
  useEffect(() => {
    console.log('🚀 App initialized:', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    // Log environment variables
    console.log('🔧 Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ProviderRegistration />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctors" 
            element={
              <ProtectedRoute>
                <DoctorManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <AppointmentManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/availability" 
            element={
              <ProtectedRoute>
                <AvailabilityManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin" 
            element={
              <SuperAdminRoute>
                <SuperAdmin />
              </SuperAdminRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 