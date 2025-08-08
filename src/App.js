import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProviderRegistration from './components/ProviderRegistration';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import AvailabilityManagement from './components/AvailabilityManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ProviderRegistration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<DoctorManagement />} />
          <Route path="/appointments" element={<AppointmentManagement />} />
          <Route path="/availability" element={<AvailabilityManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 