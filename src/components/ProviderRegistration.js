import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProviderRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/healthcare/provider/register', {
        name: data.name,
        type: data.type,
        address: data.address,
        location_lat: parseFloat(data.latitude) || null,
        location_lng: parseFloat(data.longitude) || null,
        phone: data.phone,
        email: data.email,
        website: data.website || null
      });

      if (response.data.success) {
        toast.success('Healthcare provider registered successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏥 Register Healthcare Provider</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Facility Name *</label>
            <input
              type="text"
              id="name"
              {...register('name', { 
                required: 'Facility name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
              placeholder="Enter facility name"
            />
            {errors.name && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Facility Type *</label>
            <select
              id="type"
              {...register('type', { required: 'Facility type is required' })}
            >
              <option value="">Select facility type</option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="diagnostic_center">Diagnostic Center</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
            {errors.type && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.type.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              rows="3"
              {...register('address', { 
                required: 'Address is required',
                minLength: {
                  value: 10,
                  message: 'Address must be at least 10 characters'
                }
              })}
              placeholder="Enter complete address"
            />
            {errors.address && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.address.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                step="any"
                id="latitude"
                {...register('latitude')}
                placeholder="e.g., 12.9716"
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                step="any"
                id="longitude"
                {...register('longitude')}
                placeholder="e.g., 77.5946"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phone && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Enter email address"
            />
            {errors.email && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="website">Website (Optional)</label>
            <input
              type="url"
              id="website"
              {...register('website')}
              placeholder="https://your-website.com"
            />
          </div>

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Provider'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Already have an account?</p>
          <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration; 