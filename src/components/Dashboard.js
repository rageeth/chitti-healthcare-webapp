import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const providerId = localStorage.getItem('providerId');
      const response = await axios.get(`/healthcare/provider/${providerId}/dashboard`);
      
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Mock data for demo
      setDashboardData({
        today_appointments: [
          {
            id: 1,
            appointment_time: '09:00',
            doctor_name: 'Dr. Sharma',
            specialization: 'Cardiology',
            patient_phone: '9876543210',
            status: 'confirmed'
          },
          {
            id: 2,
            appointment_time: '10:30',
            doctor_name: 'Dr. Patel',
            specialization: 'Dermatology',
            patient_phone: '9876543211',
            status: 'pending'
          }
        ],
        pending_count: 5,
        total_revenue: 25000,
        total_commission: 2500
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏥 Healthcare Provider Dashboard</h1>
        <nav className="nav-menu">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/doctors" className={location.pathname === '/doctors' ? 'active' : ''}>
            Doctors
          </Link>
          <Link to="/appointments" className={location.pathname === '/appointments' ? 'active' : ''}>
            Appointments
          </Link>
          <Link to="/availability" className={location.pathname === '/availability' ? 'active' : ''}>
            Availability
          </Link>
        </nav>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{dashboardData?.pending_count || 0}</h3>
          <p>Pending Appointments</p>
        </div>
        <div className="stat-card">
          <h3>₹{dashboardData?.total_revenue?.toLocaleString() || '0'}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>₹{dashboardData?.total_commission?.toLocaleString() || '0'}</h3>
          <p>Platform Commission</p>
        </div>
        <div className="stat-card">
          <h3>{dashboardData?.today_appointments?.length || 0}</h3>
          <p>Today's Appointments</p>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="table-container">
        <div className="table-header">
          <h2>Today's Appointments</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Patient Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.today_appointments?.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.appointment_time}</td>
                <td>{appointment.doctor_name}</td>
                <td>{appointment.specialization}</td>
                <td>{appointment.patient_phone}</td>
                <td>{getStatusBadge(appointment.status)}</td>
                <td>
                  <button 
                    className="btn" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      // TODO: Implement status update
                      toast.success('Status update functionality coming soon!');
                    }}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
            ))}
            {(!dashboardData?.today_appointments || dashboardData.today_appointments.length === 0) && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#666' }}>
                  No appointments for today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link to="/doctors" className="btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
          Add New Doctor
        </Link>
        <Link to="/availability" className="btn btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
          Manage Availability
        </Link>
        <Link to="/appointments" className="btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
          View All Appointments
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 