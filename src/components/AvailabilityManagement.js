import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AvailabilityManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const daysOfWeek = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorAvailability(selectedDoctor);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      // For demo, we'll use mock data
      setDoctors([
        {
          id: 1,
          name: 'Dr. Sharma',
          specialization: 'Cardiology'
        },
        {
          id: 2,
          name: 'Dr. Patel',
          specialization: 'Dermatology'
        }
      ]);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorAvailability = async (doctorId) => {
    try {
      const response = await axios.get(`/healthcare/doctor/${doctorId}/availability`);
      if (response.data.success) {
        setAvailability(response.data.availability);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      // For demo, we'll use mock data
      setAvailability([
        { day_of_week: 1, start_time: '09:00', end_time: '17:00', slot_duration: 30 },
        { day_of_week: 2, start_time: '09:00', end_time: '17:00', slot_duration: 30 },
        { day_of_week: 3, start_time: '09:00', end_time: '17:00', slot_duration: 30 },
        { day_of_week: 4, start_time: '09:00', end_time: '17:00', slot_duration: 30 },
        { day_of_week: 5, start_time: '09:00', end_time: '17:00', slot_duration: 30 }
      ]);
    }
  };

  const handleAvailabilityChange = (dayId, field, value) => {
    setAvailability(prev => {
      const existing = prev.find(a => a.day_of_week === dayId);
      if (existing) {
        return prev.map(a => 
          a.day_of_week === dayId ? { ...a, [field]: value } : a
        );
      } else {
        return [...prev, { day_of_week: dayId, [field]: value, slot_duration: 30 }];
      }
    });
  };

  const saveAvailability = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor first');
      return;
    }

    try {
      const availabilitySlots = availability.filter(a => a.start_time && a.end_time);
      
      await axios.post('/healthcare/doctor/availability', {
        doctor_id: selectedDoctor,
        availability_slots: availabilitySlots
      });

      toast.success('Availability updated successfully!');
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability');
    }
  };

  const getAvailabilityForDay = (dayId) => {
    return availability.find(a => a.day_of_week === dayId) || {};
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
        <h1>⏰ Availability Management</h1>
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

      {/* Doctor Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Select Doctor:
        </label>
        <select 
          value={selectedDoctor || ''} 
          onChange={(e) => setSelectedDoctor(e.target.value ? parseInt(e.target.value) : null)}
          style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', width: '300px' }}
        >
          <option value="">Choose a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </select>
      </div>

      {selectedDoctor && (
        <>
          <div className="form-container">
            <h2>Set Weekly Schedule</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Set the working hours for each day of the week. Leave empty for days when the doctor is not available.
              </p>
            </div>

            {daysOfWeek.map((day) => {
              const dayAvailability = getAvailabilityForDay(day.id);
              
              return (
                <div key={day.id} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '150px 1fr 1fr 1fr auto', 
                  gap: '1rem', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '5px',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: '500' }}>{day.name}</div>
                  
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Start Time</label>
                    <input
                      type="time"
                      value={dayAvailability.start_time || ''}
                      onChange={(e) => handleAvailabilityChange(day.id, 'start_time', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '3px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#666' }}>End Time</label>
                    <input
                      type="time"
                      value={dayAvailability.end_time || ''}
                      onChange={(e) => handleAvailabilityChange(day.id, 'end_time', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '3px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Slot Duration (min)</label>
                    <input
                      type="number"
                      value={dayAvailability.slot_duration || 30}
                      onChange={(e) => handleAvailabilityChange(day.id, 'slot_duration', parseInt(e.target.value))}
                      min="15"
                      max="120"
                      step="15"
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '3px' }}
                    />
                  </div>
                  
                  <div>
                    {dayAvailability.start_time && dayAvailability.end_time ? (
                      <span style={{ color: 'green', fontSize: '0.8rem' }}>✓ Available</span>
                    ) : (
                      <span style={{ color: '#666', fontSize: '0.8rem' }}>Not available</span>
                    )}
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                className="btn" 
                onClick={saveAvailability}
                style={{ width: 'auto', padding: '0.75rem 2rem' }}
              >
                Save Availability
              </button>
            </div>
          </div>

          {/* Current Schedule Summary */}
          <div className="table-container" style={{ marginTop: '2rem' }}>
            <div className="table-header">
              <h2>Current Schedule Summary</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Working Hours</th>
                  <th>Appointment Slots</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day) => {
                  const dayAvailability = getAvailabilityForDay(day.id);
                  const isAvailable = dayAvailability.start_time && dayAvailability.end_time;
                  
                  if (!isAvailable) {
                    return (
                      <tr key={day.id}>
                        <td>{day.name}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                          <span className="status-badge status-cancelled">Not Available</span>
                        </td>
                      </tr>
                    );
                  }

                  const startTime = new Date(`2000-01-01T${dayAvailability.start_time}`);
                  const endTime = new Date(`2000-01-01T${dayAvailability.end_time}`);
                  const durationMs = endTime - startTime;
                  const durationHours = durationMs / (1000 * 60 * 60);
                  const slotCount = Math.floor(durationHours * 60 / dayAvailability.slot_duration);

                  return (
                    <tr key={day.id}>
                      <td>{day.name}</td>
                      <td>{dayAvailability.start_time} - {dayAvailability.end_time}</td>
                      <td>{slotCount} slots ({dayAvailability.slot_duration} min each)</td>
                      <td>
                        <span className="status-badge status-confirmed">Available</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!selectedDoctor && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>Select a doctor to manage their availability</h3>
          <p>Choose a doctor from the dropdown above to set their weekly schedule.</p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManagement; 