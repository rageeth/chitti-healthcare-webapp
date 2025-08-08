import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProviderRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('form'); // 'form', 'pending', 'success'
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log('🏥 Registration attempt started:', { 
      facilityName: data.name, 
      email: data.email,
      timestamp: new Date().toISOString() 
    });
    
    setIsLoading(true);
    try {
      const response = await axios.post('/healthcare/provider/register', {
        name: data.name,
        type: data.type,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website || null
      });

      console.log('✅ Registration API response:', response.data);

      if (response.data.success) {
        console.log('✅ Registration successful');
        setRegistrationStatus('success');
        toast.success('Registration submitted successfully! Awaiting admin approval.');
      } else {
        console.log('❌ Registration failed:', response.data.message);
        toast.error(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });
      
      if (error.response?.status === 409) {
        toast.error('Email already registered. Please use a different email or login.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid data. Please check your information.');
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Registration failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Registration attempt completed');
    }
  };

  // Success/Verification Pending Screen
  if (registrationStatus === 'success') {
    return (
      <div className="login-container">
        <div className="login-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ color: '#28a745', marginBottom: '1rem' }}>✅ Registration Submitted!</h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              Your healthcare facility registration has been submitted successfully.
            </p>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '5px', marginBottom: '2rem' }}>
              <h3 style={{ color: '#ffc107', marginBottom: '0.5rem' }}>⏳ Verification Pending</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Our admin team will review your registration and approve it within 24-48 hours.<br />
                You'll receive an email notification once approved.
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                <strong>What happens next?</strong><br />
                • Admin reviews your facility details<br />
                • Approval email sent to your registered email<br />
                • You can then login and start using the platform
              </p>
            </div>
            <button 
              onClick={() => navigate('/login')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Go to Login
            </button>
            <button 
              onClick={() => setRegistrationStatus('form')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {isLoading ? 'Submitting Registration...' : 'Register Provider'}
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