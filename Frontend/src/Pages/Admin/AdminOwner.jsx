import React, { useState, useEffect } from 'react';
import './AdminOwner.css';
import OwnerProperties from './AdminOwnerProperties';
import {
  createOwner,
  getAllOwners,
  updateOwner,
  deleteOwner,
  getOwnerStats
} from '../../api/ownerApi';

const AdminOwner = () => {
  const [owners, setOwners] = useState([]);
  const [stats, setStats] = useState({
    totalOwners: 0,
    activeOwners: 0,
    blockedOwners: 0,
    ownersWithProperties: 0
  });

  // State for form
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profilePic: null,
    governmentId: null,
    bankDetails: {
      accountNumber: '',
      bankName: '',
      branch: ''
    },
    isBlocked: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('add');

  useEffect(() => {
    fetchOwners();
    fetchStats();
  }, []);

  const fetchOwners = async (search = '') => {
    try {
      const response = await getAllOwners(search);
      if (response.success) {
        setOwners(response.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getOwnerStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };


  // Filter owners based on search term
  const filteredOwners = owners.filter(owner =>
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone.includes(searchTerm)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('bankDetails.')) {
      const bankField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setIsUploading(true);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setError('Full Name, Email, Phone and Address are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'bankDetails') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (isEditing) {
        await updateOwner(formData.id, data);
        setSuccess('Owner updated successfully!');
      } else {
        await createOwner(data);
        setSuccess('Owner added successfully!');
      }
      resetForm();
      fetchOwners();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (owner) => {
    setFormData({
      id: owner.id,
      fullName: owner.fullName,
      email: owner.email,
      phone: owner.phone,
      address: owner.address,
      profilePic: null,
      governmentId: null,
      bankDetails: owner.bankDetails || {
        accountNumber: '',
        bankName: '',
        branch: ''
      },
      isBlocked: owner.isBlocked || false
    });
    setIsEditing(true);
    setActiveTab('add');
  };

  const handleDelete = async (ownerId) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      try {
        await deleteOwner(ownerId);
        setSuccess('Owner deleted successfully!');
        fetchOwners();
        fetchStats();
        if (isEditing && formData.id === ownerId) {
          resetForm();
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleBlockToggle = async (ownerId) => {
    const owner = owners.find(o => o._id === ownerId);
    if (!owner) return;

    const updatedData = { isBlocked: !owner.isBlocked };

    try {
      await updateOwner(ownerId, updatedData);
      setSuccess(`Owner ${owner.isBlocked ? 'unblocked' : 'blocked'} successfully!`);
      fetchOwners();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewProperties = (owner) => {
    setSelectedOwner(owner);
    setShowProperties(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      profilePic: null,
      governmentId: null,
      bankDetails: {
        accountNumber: '',
        bankName: '',
        branch: ''
      },
      isBlocked: false
    });
    setIsEditing(false);
    setIsUploading(false);
  };

  // Owner statistics
  const calculateOwnerStats = () => {
    const totalOwners = owners.length;
    const activeOwners = owners.filter(owner => !owner.isBlocked).length;
    const blockedOwners = totalOwners - activeOwners;
    const ownersWithProperties = owners.filter(owner => owner.properties && owner.properties.length > 0).length;

    return {
      totalOwners,
      activeOwners,
      blockedOwners,
      ownersWithProperties
    };
  };

  const ownerStats = calculateOwnerStats();

  return (
    <div className="owner-management-container">
      <h1 className="title">Owner Management</h1>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          {isEditing ? 'Edit Owner' : 'Add Owner'}
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('view');
            fetchOwners();
          }}
        >
          View All Owners
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('stats');
            fetchStats();
          }}
        >
          Statistics
        </button>
      </div>

      {/* Add/Edit Owner Form */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="owner-form">
          {/* Owner Statistics Summary */}
          <div className="stats-summary">
            <div className="stat-card">
              <div>
                <h3>Total Owners</h3>
                <p>{stats.totalOwners}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Active</h3>
                <p>{stats.activeOwners}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Blocked</h3>
                <p>{stats.blockedOwners}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>With Properties</h3>
                <p>{stats.ownersWithProperties}</p>
              </div>
            </div>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Profile Picture {isUploading && '(Uploading...)'}</label>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {isEditing && !formData.profilePic && (
                  <div className="small-text">
                    Current: {owners.find(o => o.id === formData.id)?.profile_pic ? 'Image uploaded' : 'Using default avatar'}
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="form-section">
            <h2 className="section-title">Bank Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <input
                  type="text"
                  name="bankDetails.branch"
                  value={formData.bankDetails.branch}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-section">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isBlocked"
                    checked={formData.isBlocked}
                    onChange={(e) => setFormData({ ...formData, isBlocked: e.target.checked })}
                  />
                  <span>Block this owner</span>
                </label>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isUploading}>
              {isUploading ? 'Processing...' : isEditing ? 'Update Owner' : 'Add Owner'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="submit-button cancel-button"
                disabled={isUploading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* View All Owners */}
      {activeTab === 'view' && (
        <div className="owners-list">
          <div className="list-header">
            <h2 className="section-title">All Owners ({filteredOwners.length})</h2>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  fetchOwners(e.target.value);
                }}
                className="search-input"
              />
            </div>
          </div>

          {filteredOwners.length === 0 ? (
            <div className="no-results">
              No owners found matching your search
            </div>
          ) : (
            <table className="owners-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map(owner => (
                  <tr key={owner.id} className={owner.isBlocked ? 'blocked' : ''}>
                    <td>
                      <img
                        src={owner.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName)}&background=random&color=fff`}
                        alt={owner.fullName}
                        className="owner-thumbnail"
                      />
                    </td>
                    <td>
                      <div>{owner.id}</div>
                    </td>
                    <td>
                      <div className="owner-name">{owner.fullName}</div>
                      <div className="small-text">{owner.email}</div>
                    </td>
                    <td>
                      <div>{owner.phone}</div>
                      <div className="small-text">{owner.address}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleBlockToggle(owner.id)}
                        className={`status-badge ${owner.isBlocked ? 'blocked' : 'active'}`}
                      >
                        {owner.isBlocked ? 'Blocked' : 'Active'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(owner)}
                          className="action-button edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewProperties(owner)}
                          className="action-button properties"
                        >
                          Properties
                        </button>
                        <button
                          onClick={() => handleDelete(owner.id)}
                          className="action-button delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Statistics View */}
      {activeTab === 'stats' && (
        <div className="stats-view">
          <h2 className="section-title">Owner Statistics</h2>

          <div className="stats-cards">
            <div className="stat-card large">
              <h3>Owner Distribution</h3>
              <div className="progress-circle">
                <svg>
                  <circle className="bg" cx="60" cy="60" r="50"></circle>
                  <circle
                    className="progress"
                    cx="60"
                    cy="60"
                    r="50"
                    style={{
                      strokeDashoffset: stats.totalOwners > 0 ? 314 - (314 * (stats.activeOwners / stats.totalOwners)) : 314
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {stats.totalOwners > 0 ? Math.round((stats.activeOwners / stats.totalOwners) * 100) : 0}%
                </div>
              </div>
              <p>{stats.activeOwners} of {stats.totalOwners} owners active</p>
            </div>

            <div className="stat-card">
              <h3>Total Owners</h3>
              <div className="big-number">{stats.totalOwners}</div>
              <div className="stats-details">
                <div>Active: {stats.activeOwners}</div>
                <div>Blocked: {stats.blockedOwners}</div>
                <div>With Properties: {stats.ownersWithProperties}</div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Owners with Properties</h3>
              <div className="big-number">{stats.ownersWithProperties}</div>
              <p>{stats.totalOwners > 0 ? Math.round((stats.ownersWithProperties / stats.totalOwners) * 100) : 0}% of total</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Owner Status Distribution</h3>
            <div className="bar-chart">
              <div className="bar" style={{ height: `${stats.totalOwners > 0 ? (stats.activeOwners / stats.totalOwners) * 100 : 0}%` }}>
                <div className="bar-label">Active</div>
                <div className="bar-value">{stats.activeOwners}</div>
              </div>
              <div className="bar" style={{ height: `${stats.totalOwners > 0 ? (stats.blockedOwners / stats.totalOwners) * 100 : 0}%` }}>
                <div className="bar-label">Blocked</div>
                <div className="bar-value">{stats.blockedOwners}</div>
              </div>
              <div className="bar" style={{ height: `${stats.totalOwners > 0 ? (stats.ownersWithProperties / stats.totalOwners) * 100 : 0}%` }}>
                <div className="bar-label">With Properties</div>
                <div className="bar-value">{stats.ownersWithProperties}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Owner Properties Modal */}
      {showProperties && (
        <OwnerProperties
          owner={selectedOwner}
          onClose={() => setShowProperties(false)}
        />
      )}
    </div>
  );
};

export default AdminOwner;