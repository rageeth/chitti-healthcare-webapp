import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log('🚀 Login attempt started:', { email: data.email, timestamp: new Date().toISOString() });
    setIsLoading(true);
    
    try {
      // Demo login fallback
      if (data.email === 'demo@hospital.com' && data.password === 'demo123') {
        console.log('✅ Demo login successful');
        localStorage.setItem('healthcareToken', 'demo-token-123');
        localStorage.setItem('providerId', 'demo-provider-123');
        localStorage.setItem('userEmail', data.email);
        toast.success('Demo login successful! Welcome to the healthcare dashboard.');
        navigate('/dashboard');
        return;
      }

      console.log('🌐 Attempting API login to:', '/healthcare/admin/login');
      
      // For now, we'll use a simple login
      // In production, this should be a proper authentication endpoint
      const response = await axios.post('/healthcare/admin/login', {
        email: data.email,
        password: data.password
      });

      console.log('📡 API Response:', response.data);

      if (response.data.success) {
        console.log('✅ API login successful');
        localStorage.setItem('healthcareToken', response.data.token);
        localStorage.setItem('providerId', response.data.provider_id);
        localStorage.setItem('userEmail', data.email);
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      if (error.response?.status === 404) {
        toast.error('API endpoint not found. Please check the backend configuration.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Login attempt completed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏥 Healthcare Provider Login</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
              placeholder="Enter your email"
            />
            {errors.email && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              placeholder="Enter your password"
            />
            {errors.password && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Don't have an account?</p>
          <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
            Register your healthcare facility
          </Link>
        </div>

        {/* Demo Login */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Demo Login:</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Email: demo@hospital.com<br />
            Password: demo123
          </p>
          <button 
            onClick={() => {
              console.log('🎯 Demo login button clicked');
              document.getElementById('email').value = 'demo@hospital.com';
              document.getElementById('password').value = 'demo123';
            }}
            style={{ 
              marginTop: '0.5rem', 
              padding: '0.5rem 1rem', 
              background: '#667eea', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px', 
              cursor: 'pointer' 
            }}
          >
            Fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 