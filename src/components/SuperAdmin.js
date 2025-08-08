import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const SuperAdmin = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('👑 Super Admin Dashboard loaded');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('📊 Fetching super admin data...');
      
      // Fetch pending registrations
      const pendingResponse = await axios.get('/healthcare/admin/pending-registrations');
      setPendingRegistrations(pendingResponse.data.registrations || []);
      
      // Fetch approved providers
      const approvedResponse = await axios.get('/healthcare/admin/approved-providers');
      setApprovedProviders(approvedResponse.data.providers || []);
      
      console.log('✅ Super admin data loaded:', {
        pending: pendingResponse.data.registrations?.length || 0,
        approved: approvedResponse.data.providers?.length || 0
      });
    } catch (error) {
      console.error('❌ Error fetching super admin data:', error);
      toast.error('Failed to load data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      console.log('✅ Approving registration:', registrationId);
      
      const response = await axios.post(`/healthcare/admin/approve-registration/${registrationId}`);
      
      if (response.data.success) {
        toast.success('Registration approved successfully!');
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('❌ Error approving registration:', error);
      toast.error('Failed to approve registration.');
    }
  };

  const handleReject = async (registrationId, reason) => {
    try {
      console.log('❌ Rejecting registration:', registrationId, reason);
      
      const response = await axios.post(`/healthcare/admin/reject-registration/${registrationId}`, {
        reason: reason
      });
      
      if (response.data.success) {
        toast.success('Registration rejected.');
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('❌ Error rejecting registration:', error);
      toast.error('Failed to reject registration.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    navigate('/login');
  };

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
                    <p><strong>Approved:</strong> {new Date(provider.approved_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin; 