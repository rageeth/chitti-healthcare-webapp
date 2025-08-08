import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const location = useLocation();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // For demo, we'll use mock data
      setAppointments([
        {
          id: 1,
          appointment_date: '2024-01-15',
          appointment_time: '09:00',
          doctor_name: 'Dr. Sharma',
          specialization: 'Cardiology',
          patient_phone: '9876543210',
          status: 'confirmed',
          consultation_fee: 1500,
          symptoms: 'Chest pain and shortness of breath'
        },
        {
          id: 2,
          appointment_date: '2024-01-15',
          appointment_time: '10:30',
          doctor_name: 'Dr. Patel',
          specialization: 'Dermatology',
          patient_phone: '9876543211',
          status: 'pending',
          consultation_fee: 1200,
          symptoms: 'Skin rash and itching'
        },
        {
          id: 3,
          appointment_date: '2024-01-14',
          appointment_time: '14:00',
          doctor_name: 'Dr. Sharma',
          specialization: 'Cardiology',
          patient_phone: '9876543212',
          status: 'completed',
          consultation_fee: 1500,
          symptoms: 'Regular checkup'
        }
      ]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/healthcare/appointment/${appointmentId}/status`, {
        status: newStatus
      });
      
      toast.success('Appointment status updated successfully!');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
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

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

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
        <h1>📅 Appointment Management</h1>
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

      {/* Filter Controls */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label style={{ fontWeight: '500' }}>Filter by status:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
        >
          <option value="all">All Appointments</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Appointments ({filteredAppointments.length})</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Patient Phone</th>
              <th>Symptoms</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <div>
                    <strong>{new Date(appointment.appointment_date).toLocaleDateString()}</strong>
                    <br />
                    <span style={{ color: '#666' }}>{appointment.appointment_time}</span>
                  </div>
                </td>
                <td>{appointment.doctor_name}</td>
                <td>{appointment.specialization}</td>
                <td>{appointment.patient_phone}</td>
                <td>
                  <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {appointment.symptoms}
                  </div>
                </td>
                <td>₹{appointment.consultation_fee}</td>
                <td>{getStatusBadge(appointment.status)}</td>
                <td>
                  {appointment.status === 'pending' && (
                    <>
                      <button 
                        className="btn" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                        onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                      >
                        Confirm
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button 
                      className="btn" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                    >
                      Mark Complete
                    </button>
                  )}
                  {appointment.status === 'completed' && (
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>Completed</span>
                  )}
                  {appointment.status === 'cancelled' && (
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>Cancelled</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: '#666' }}>
                  No appointments found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="stat-card">
          <h3>{appointments.filter(a => a.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{appointments.filter(a => a.status === 'confirmed').length}</h3>
          <p>Confirmed</p>
        </div>
        <div className="stat-card">
          <h3>{appointments.filter(a => a.status === 'completed').length}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>₹{appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.consultation_fee, 0).toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement; 