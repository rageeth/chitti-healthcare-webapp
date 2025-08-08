import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import './SuperAdmin.css';

const SuperAdmin = () => {
  // CSP-compliant clipboard fallback function
  const copyToClipboardFallback = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('Credentials copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy credentials. Please copy manually.');
    }
    document.body.removeChild(textArea);
  };

  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [adminDetails, setAdminDetails] = useState({});
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [showResetCredentials, setShowResetCredentials] = useState(false);
  const [resetCredentials, setResetCredentials] = useState({});

  const handleLogout = useCallback(() => {
    localStorage.removeItem('superAdminToken');
    setIsLoggedIn(false);
    setPendingRegistrations([]);
    setApprovedProviders([]);
    toast.success('Logged out successfully');
  }, []);

  const fetchData = useCallback(async () => {
    try {
      console.log('📊 Fetching super admin data...');
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch pending registrations
      const pendingResponse = await api.get('/healthcare/admin/pending-registrations', { headers });
      setPendingRegistrations(pendingResponse.data.registrations || []);
      
      // Fetch approved providers
      const approvedResponse = await api.get('/healthcare/admin/approved-providers', { headers });
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
  }, [handleLogout]);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    console.log('👑 Super Admin Dashboard loaded');
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔐 Super admin login attempt:', loginForm.email);
      
      const response = await api.post('/healthcare/super-admin/login', loginForm);
      
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

  const handleApprove = async (registrationId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      console.log('✅ Approving registration:', registrationId);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.post(`/healthcare/admin/approve-registration/${registrationId}`, {}, { headers });
      
      if (response.data.success) {
        toast.success('Registration approved successfully!');
        
        // Show credentials if available
        if (response.data.admin_credentials) {
          setCredentials(response.data.admin_credentials);
          setShowCredentials(true);
        }
        
        fetchData(); // Refresh data
      } else {
        toast.error('Failed to approve registration');
      }
    } catch (error) {
      console.error('❌ Error approving registration:', error);
      toast.error('Failed to approve registration. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (registrationId, reason) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      console.log('❌ Rejecting registration:', registrationId, 'Reason:', reason);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.post(`/healthcare/admin/reject-registration/${registrationId}`, {
        reason: reason
      }, { headers });
      
      if (response.data.success) {
        toast.success('Registration rejected successfully!');
        fetchData(); // Refresh data
      } else {
        toast.error('Failed to reject registration');
      }
    } catch (error) {
      console.error('❌ Error rejecting registration:', error);
      toast.error('Failed to reject registration. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async (adminId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      console.log('🔑 Resetting password for admin:', adminId);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.post(`/healthcare/admin/reset-password/${adminId}`, {}, { headers });
      
      if (response.data.success) {
        toast.success('Password reset successfully!');
        
        // Show new password if available
        if (response.data.new_password) {
          setResetCredentials({
            email: response.data.admin?.email || 'Admin Email',
            password: response.data.new_password
          });
          setShowResetCredentials(true);
        }
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewAdminDetails = async (adminId) => {
    try {
      console.log('👤 Viewing admin details:', adminId);
      
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.get(`/healthcare/admin/${adminId}`, { headers });
      
      if (response.data.success) {
        setAdminDetails(response.data.admin);
        setShowAdminDetails(true);
      } else {
        toast.error('Failed to load admin details');
      }
    } catch (error) {
      console.error('❌ Error loading admin details:', error);
      toast.error('Failed to load admin details. Please try again.');
    }
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="super-admin-login">
        <div className="login-container">
          <div className="login-header">
            <div className="crown-icon">👑</div>
            <h1>Super Admin Login</h1>
            <p>Access the healthcare provider management system</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login as Super Admin'}
            </button>
          </form>
          
          <div className="demo-credentials">
            <h3>Demo Credentials:</h3>
            <p><strong>Email:</strong> superadmin@chitti.com</p>
            <p><strong>Password:</strong> superadmin123</p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="super-admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="crown-icon">👑</div>
            <h1>Super Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Approvals</h3>
              <div className="stat-number">{pendingRegistrations.length}</div>
            </div>
          </div>
          
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Approved Providers</h3>
              <div className="stat-number">{approvedProviders.length}</div>
            </div>
          </div>
          
          <div className="stat-card total">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h3>Total Facilities</h3>
              <div className="stat-number">{pendingRegistrations.length + approvedProviders.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Approvals ({pendingRegistrations.length})
            </button>
            <button 
              className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved Providers ({approvedProviders.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'pending' && (
                <div className="pending-section">
                  {pendingRegistrations.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🎉</div>
                      <h3>No Pending Approvals</h3>
                      <p>All healthcare provider registrations have been processed!</p>
                    </div>
                  ) : (
                    <div className="registrations-grid">
                      {pendingRegistrations.map((registration) => (
                        <div key={registration.id} className="registration-card">
                          <div className="card-header">
                            <h3>{registration.name}</h3>
                            <span className="provider-type">{registration.type}</span>
                          </div>
                          
                          <div className="card-details">
                            <div className="detail-item">
                              <span className="label">📧 Email:</span>
                              <span className="value">{registration.email}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">📞 Phone:</span>
                              <span className="value">{registration.phone}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">📍 Address:</span>
                              <span className="value">{registration.address}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">📅 Submitted:</span>
                              <span className="value">{new Date(registration.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="card-actions">
                            <button 
                              onClick={() => handleApprove(registration.id)}
                              className="approve-btn"
                              disabled={isProcessing}
                            >
                              <span>✅</span> Approve
                            </button>
                            <button 
                              onClick={() => handleReject(registration.id, 'Rejected by super admin')}
                              className="reject-btn"
                              disabled={isProcessing}
                            >
                              <span>❌</span> Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'approved' && (
                <div className="approved-section">
                  {approvedProviders.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🏥</div>
                      <h3>No Approved Providers</h3>
                      <p>No healthcare providers have been approved yet.</p>
                    </div>
                  ) : (
                    <div className="providers-grid">
                      {approvedProviders.map((provider) => (
                        <div key={provider.id} className="provider-card">
                          <div className="card-header">
                            <h3>{provider.name}</h3>
                            <span className="provider-type">{provider.type}</span>
                          </div>
                          
                          <div className="card-details">
                            <div className="detail-item">
                              <span className="label">📧 Email:</span>
                              <span className="value">{provider.email}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">📞 Phone:</span>
                              <span className="value">{provider.phone}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">📍 Address:</span>
                              <span className="value">{provider.address}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">📅 Approved:</span>
                              <span className="value">{new Date(provider.updated_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="card-actions">
                            <button 
                              onClick={() => handleViewAdminDetails(provider.id)}
                              className="view-btn"
                            >
                              <span>👤</span> View Admin
                            </button>
                            <button 
                              onClick={() => handleResetPassword(provider.id)}
                              className="reset-btn"
                              disabled={isProcessing}
                            >
                              <span>🔑</span> Reset Password
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Admin Details Modal */}
      {showAdminDetails && (
        <div className="modal-overlay" onClick={() => setShowAdminDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Admin Details</h2>
              <button onClick={() => setShowAdminDetails(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="admin-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{adminDetails.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{adminDetails.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Provider:</span>
                  <span className="value">{adminDetails.provider_name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Provider Type:</span>
                  <span className="value">{adminDetails.provider_type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span className="value">{new Date(adminDetails.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => handleResetPassword(adminDetails.id)}
                className="reset-btn"
                disabled={isProcessing}
              >
                <span>🔑</span> Reset Password
              </button>
              <button onClick={() => setShowAdminDetails(false)} className="cancel-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Credentials Modal */}
      {showCredentials && (
        <div className="modal-overlay" onClick={() => setShowCredentials(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔑 Admin Credentials Generated</h2>
              <button onClick={() => setShowCredentials(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="credentials-info">
                <div className="info-box">
                  <p>✅ Healthcare provider has been approved successfully!</p>
                  <p>Admin credentials have been generated. Please save these credentials securely:</p>
                </div>
                
                                 <div className="credentials-display">
                   <div className="credential-item">
                     <span className="label">📧 Email/Username:</span>
                     <span className="value">{credentials.username}</span>
                   </div>
                   <div className="credential-item">
                     <span className="label">🔑 Password:</span>
                     <span className="value password-value">{credentials.password}</span>
                   </div>
                 </div>
                 
                 {/* Backup text display for CSP issues */}
                 <div className="credentials-text-backup">
                   <p><strong>Credentials (copy manually if needed):</strong></p>
                   <p>Email: {credentials.username}</p>
                   <p>Password: {credentials.password}</p>
                 </div>
                
                <div className="credentials-warning">
                  <p>⚠️ <strong>Important:</strong></p>
                  <ul>
                    <li>These credentials are only shown once</li>
                    <li>Share them securely with the healthcare provider</li>
                    <li>They can use these credentials to login at the main login page</li>
                    <li>You can reset the password later if needed</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="modal-footer">
                             <button 
                 onClick={() => {
                   // Copy credentials to clipboard - CSP compliant
                   const text = `Email: ${credentials.username}\nPassword: ${credentials.password}`;
                   if (navigator.clipboard && window.isSecureContext) {
                     navigator.clipboard.writeText(text).then(() => {
                       toast.success('Credentials copied to clipboard!');
                     }).catch(() => {
                       // Fallback for older browsers
                       copyToClipboardFallback(text);
                     });
                   } else {
                     // Fallback for non-secure contexts
                     copyToClipboardFallback(text);
                   }
                 }}
                 className="copy-btn"
               >
                <span>📋</span> Copy to Clipboard
              </button>
              <button onClick={() => setShowCredentials(false)} className="cancel-btn">
                Close
              </button>
            </div>
          </div>
                 </div>
       )}

       {/* Reset Password Credentials Modal */}
       {showResetCredentials && (
         <div className="modal-overlay" onClick={() => setShowResetCredentials(false)}>
           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
             <div className="modal-header">
               <h2>🔑 Password Reset Successful</h2>
               <button onClick={() => setShowResetCredentials(false)} className="close-btn">×</button>
             </div>
             <div className="modal-body">
               <div className="credentials-info">
                 <div className="info-box">
                   <p>✅ Password has been reset successfully!</p>
                   <p>New credentials have been generated. Please share these securely:</p>
                 </div>
                 
                 <div className="credentials-display">
                   <div className="credential-item">
                     <span className="label">📧 Email:</span>
                     <span className="value">{resetCredentials.email}</span>
                   </div>
                   <div className="credential-item">
                     <span className="label">🔑 New Password:</span>
                     <span className="value password-value">{resetCredentials.password}</span>
                   </div>
                 </div>
                 
                 {/* Backup text display for CSP issues */}
                 <div className="credentials-text-backup">
                   <p><strong>New Credentials (copy manually if needed):</strong></p>
                   <p>Email: {resetCredentials.email}</p>
                   <p>New Password: {resetCredentials.password}</p>
                 </div>
                 
                 <div className="credentials-warning">
                   <p>⚠️ <strong>Important:</strong></p>
                   <ul>
                     <li>This new password is only shown once</li>
                     <li>Share it securely with the healthcare provider</li>
                     <li>They can use these credentials to login immediately</li>
                     <li>The old password is no longer valid</li>
                   </ul>
                 </div>
               </div>
             </div>
             <div className="modal-footer">
               <button 
                 onClick={() => {
                   // Copy credentials to clipboard - CSP compliant
                   const text = `Email: ${resetCredentials.email}\nNew Password: ${resetCredentials.password}`;
                   if (navigator.clipboard && window.isSecureContext) {
                     navigator.clipboard.writeText(text).then(() => {
                       toast.success('New credentials copied to clipboard!');
                     }).catch(() => {
                       // Fallback for older browsers
                       copyToClipboardFallback(text);
                     });
                   } else {
                     // Fallback for non-secure contexts
                     copyToClipboardFallback(text);
                   }
                 }}
                 className="copy-btn"
               >
                 <span>📋</span> Copy to Clipboard
               </button>
               <button onClick={() => setShowResetCredentials(false)} className="cancel-btn">
                 Close
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default SuperAdmin; 