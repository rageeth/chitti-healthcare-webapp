import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const location = useLocation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchSpecializations();
    fetchDoctors();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get('/healthcare/specializations');
      if (response.data.success) {
        setSpecializations(response.data.specializations);
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      // For demo, we'll use mock data
      setDoctors([
        {
          id: 1,
          name: 'Dr. Sharma',
          specialization: 'Cardiology',
          experience_years: 15,
          qualification: 'MBBS, MD (Cardiology)',
          consultation_fee: 1500,
          is_available: true,
          rating: 4.8
        },
        {
          id: 2,
          name: 'Dr. Patel',
          specialization: 'Dermatology',
          experience_years: 12,
          qualification: 'MBBS, MD (Dermatology)',
          consultation_fee: 1200,
          is_available: true,
          rating: 4.6
        }
      ]);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const providerId = localStorage.getItem('providerId');
      const response = await axios.post('/healthcare/doctor/add', {
        provider_id: providerId,
        name: data.name,
        specialization: data.specialization,
        experience_years: parseInt(data.experience_years),
        qualification: data.qualification,
        consultation_fee: parseFloat(data.consultation_fee),
        bio: data.bio
      });

      if (response.data.success) {
        toast.success('Doctor added successfully!');
        setShowAddForm(false);
        reset();
        fetchDoctors();
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Failed to add doctor');
    }
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
        <h1>👨‍⚕️ Doctor Management</h1>
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

      <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
        <button 
          className="btn" 
          style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Doctor'}
        </button>
      </div>

      {showAddForm && (
        <div className="form-container" style={{ marginBottom: '2rem' }}>
          <h2>Add New Doctor</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Doctor Name *</label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { 
                    required: 'Doctor name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters'
                    }
                  })}
                  placeholder="Enter doctor name"
                />
                {errors.name && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="specialization">Specialization *</label>
                <select
                  id="specialization"
                  {...register('specialization', { required: 'Specialization is required' })}
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {errors.specialization && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.specialization.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience_years">Experience (Years) *</label>
                <input
                  type="number"
                  id="experience_years"
                  {...register('experience_years', { 
                    required: 'Experience is required',
                    min: {
                      value: 0,
                      message: 'Experience cannot be negative'
                    }
                  })}
                  placeholder="Enter years of experience"
                />
                {errors.experience_years && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.experience_years.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="consultation_fee">Consultation Fee (₹) *</label>
                <input
                  type="number"
                  id="consultation_fee"
                  {...register('consultation_fee', { 
                    required: 'Consultation fee is required',
                    min: {
                      value: 0,
                      message: 'Fee cannot be negative'
                    }
                  })}
                  placeholder="Enter consultation fee"
                />
                {errors.consultation_fee && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.consultation_fee.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="qualification">Qualification *</label>
              <input
                type="text"
                id="qualification"
                {...register('qualification', { 
                  required: 'Qualification is required'
                })}
                placeholder="e.g., MBBS, MD (Cardiology)"
              />
              {errors.qualification && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.qualification.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="3"
                {...register('bio')}
                placeholder="Enter doctor's bio and expertise"
              />
            </div>

            <button type="submit" className="btn">
              Add Doctor
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h2>Doctors List</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Qualification</th>
              <th>Consultation Fee</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.experience_years} years</td>
                <td>{doctor.qualification}</td>
                <td>₹{doctor.consultation_fee}</td>
                <td>⭐ {doctor.rating}</td>
                <td>
                  <span className={`status-badge ${doctor.is_available ? 'status-confirmed' : 'status-cancelled'}`}>
                    {doctor.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                    onClick={() => {/* Edit doctor */}}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    onClick={() => {/* Toggle availability */}}
                  >
                    {doctor.is_available ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: '#666' }}>
                  No doctors found. Add your first doctor above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagement; 