import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SuperAdmin = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [adminDetails, setAdminDetails] = useState({});
  const [showAdminDetails, setShowAdminDetails] = useState(false);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('👑 Super Admin Dashboard loaded');
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔐 Super admin login attempt:', loginForm.email);
      
      const response = await axios.post('/healthcare/super-admin/login', loginForm);
      
      if (response.data.success) {
        console.log('✅ Super admin login successful');
        localStorage.setItem('superAdminToken', response.data.token);
        setIsLoggedIn(true);
        toast.success('Super admin login successful!');
        fetchData();
      }
    } catch (error) {
      console.error('❌ Super admin login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      console.log('📊 Fetching super admin data...');
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch pending registrations
      const pendingResponse = await axios.get('/healthcare/admin/pending-registrations', { headers });
      setPendingRegistrations(pendingResponse.data.registrations || []);
      
      // Fetch approved providers
      const approvedResponse = await axios.get('/healthcare/admin/approved-providers', { headers });
      setApprovedProviders(approvedResponse.data.providers || []);
      
      console.log('✅ Super admin data loaded:', {
        pending: pendingResponse.data.registrations?.length || 0,
        approved: approvedResponse.data.providers?.length || 0
      });
    } catch (error) {
      console.error('❌ Error fetching super admin data:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to load data. Please refresh the page.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      console.log('✅ Approving registration:', registrationId);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.post(`/healthcare/admin/approve-registration/${registrationId}`, {}, { headers });
      
      if (response.data.success) {
        toast.success('Registration approved successfully! Admin credentials sent via email.');
        console.log('🔑 Admin credentials created:', response.data.admin_credentials);
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('❌ Error approving registration:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to approve registration.');
      }
    }
  };

  const handleReject = async (registrationId, reason) => {
    try {
      console.log('❌ Rejecting registration:', registrationId, reason);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.post(`/healthcare/admin/reject-registration/${registrationId}`, {
        reason: reason
      }, { headers });
      
      if (response.data.success) {
        toast.success('Registration rejected.');
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('❌ Error rejecting registration:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to reject registration.');
      }
    }
  };

  const handleResetPassword = async (adminId) => {
    try {
      console.log('🔑 Resetting password for admin:', adminId);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.post(`/healthcare/admin/reset-password/${adminId}`, {}, { headers });
      
      if (response.data.success) {
        toast.success('Password reset successfully! New credentials sent via email.');
        console.log('🔑 New password generated:', response.data.new_password);
      }
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to reset password.');
      }
    }
  };

  const handleViewAdminDetails = async (adminId) => {
    try {
      console.log('👤 Fetching admin details:', adminId);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`/healthcare/admin/${adminId}`, { headers });
      
      if (response.data.success) {
        setAdminDetails(response.data.admin);
        setShowAdminDetails(true);
      }
    } catch (error) {
      console.error('❌ Error fetching admin details:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to fetch admin details.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    setIsLoggedIn(false);
    setPendingRegistrations([]);
    setApprovedProviders([]);
    toast.success('Logged out successfully');
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>👑 Super Admin Login</h1>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="superadmin@chitti.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="superadmin123"
                required
              />
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login as Super Admin'}
            </button>
          </form>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              <strong>Demo Credentials:</strong><br />
              Email: superadmin@chitti.com<br />
              Password: superadmin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading Super Admin Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👑 Super Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p className="stat-number">{pendingRegistrations.length}</p>
        </div>
        <div className="stat-card">
          <h3>Approved Providers</h3>
          <p className="stat-number">{approvedProviders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Facilities</h3>
          <p className="stat-number">{pendingRegistrations.length + approvedProviders.length}</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals ({pendingRegistrations.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Providers ({approvedProviders.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'pending' && (
          <div className="registrations-list">
            <h2>Pending Registration Requests</h2>
            {pendingRegistrations.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                No pending registration requests.
              </p>
            ) : (
              pendingRegistrations.map((registration) => (
                <div key={registration.id} className="registration-card">
                  <div className="registration-header">
                    <h3>{registration.name}</h3>
                    <span className="facility-type">{registration.type}</span>
                  </div>
                  <div className="registration-details">
                    <p><strong>Email:</strong> {registration.email}</p>
                    <p><strong>Phone:</strong> {registration.phone}</p>
                    <p><strong>Address:</strong> {registration.address}</p>
                    {registration.website && (
                      <p><strong>Website:</strong> {registration.website}</p>
                    )}
                    <p><strong>Submitted:</strong> {new Date(registration.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="registration-actions">
                    <button 
                      onClick={() => handleApprove(registration.id)}
                      className="btn-approve"
                    >
                      ✅ Approve
                    </button>
                    <button 
                      onClick={() => handleReject(registration.id, 'Rejected by admin')}
                      className="btn-reject"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="providers-list">
            <h2>Approved Healthcare Providers</h2>
            {approvedProviders.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                No approved providers yet.
              </p>
            ) : (
              approvedProviders.map((provider) => (
                <div key={provider.id} className="provider-card">
                  <div className="provider-header">
                    <h3>{provider.name}</h3>
                    <span className="facility-type">{provider.type}</span>
                    <span className="status-approved">✅ Approved</span>
                  </div>
                  <div className="provider-details">
                    <p><strong>Email:</strong> {provider.email}</p>
                    <p><strong>Phone:</strong> {provider.phone}</p>
                    <p><strong>Address:</strong> {provider.address}</p>
                    {provider.website && (
                      <p><strong>Website:</strong> {provider.website}</p>
                    )}
                    <p><strong>Approved:</strong> {new Date(provider.updated_at).toLocaleDateString()}</p>
                  </div>
                  <div className="provider-actions">
                    <button 
                      onClick={() => handleViewAdminDetails(provider.id)}
                      className="btn-secondary"
                      style={{ marginRight: '0.5rem' }}
                    >
                      👤 View Admin
                    </button>
                    <button 
                      onClick={() => handleResetPassword(provider.id)}
                      className="btn-warning"
                    >
                      🔑 Reset Password
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Admin Details Modal */}
        {showAdminDetails && (
          <div className="modal-overlay" onClick={() => setShowAdminDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>👤 Hospital Admin Details</h3>
                <button onClick={() => setShowAdminDetails(false)} className="close-btn">×</button>
              </div>
              <div className="modal-body">
                <div className="admin-details">
                  <p><strong>Admin Name:</strong> {adminDetails.name}</p>
                  <p><strong>Email:</strong> {adminDetails.email}</p>
                  <p><strong>Phone:</strong> {adminDetails.phone}</p>
                  <p><strong>Provider:</strong> {adminDetails.provider_name}</p>
                  <p><strong>Provider Type:</strong> {adminDetails.provider_type}</p>
                  <p><strong>Role:</strong> {adminDetails.role}</p>
                  <p><strong>Created:</strong> {new Date(adminDetails.created_at).toLocaleDateString()}</p>
                  {adminDetails.last_login && (
                    <p><strong>Last Login:</strong> {new Date(adminDetails.last_login).toLocaleString()}</p>
                  )}
                </div>
                <div className="modal-actions">
                  <button 
                    onClick={() => handleResetPassword(adminDetails.id)}
                    className="btn-warning"
                  >
                    🔑 Reset Password
                  </button>
                  <button 
                    onClick={() => setShowAdminDetails(false)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin; 