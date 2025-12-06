import React, { useState, useEffect, useContext } from 'react';
import './AdminOwner.css';
import OwnerProperties from './AdminOwnerProperties';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthContext} from '../../Context/AuthContext'; 
import Loading from '../Loading';

const AdminOwner = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const [imagePreview, setImagePreview] = useState(null);
  
  const { getOwners, addOwner, updateOwner, deleteOwner, updateOwnerStatus } = useContext (AuthContext);

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    email: '',
    phoneNumber: '',
    address: '',
    profile_pic: null,
    bankDetails: {
      accountNumber: '',
      bankName: '',
      branch: ''
    },
    status: 'Active',
    verified: false
  });

  const loadOwners = async () => {
    try {
      setLoading(true);
      const ownersData = await getOwners();
      setOwners(ownersData);
    } catch (err) {
      toast.error('Failed to load owners');
      console.error('Error fetching owners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const filteredOwners = owners.filter(owner =>
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phoneNumber.includes(searchTerm)
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('bankDetails.')) {
      const bankField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(files[0]);

      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await updateOwner(formData._id, formData);
        toast.success('Owner updated successfully!');
      } else {
        await addOwner(formData);
        toast.success('Owner added successfully!');
      }

      await loadOwners();
      resetForm();
    } catch (err) {
      toast.error('Failed to save owner');
      console.error('Error saving owner:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (owner) => {
    setFormData({
      _id: owner._id,
      fullName: owner.fullName,
      displayName: owner.displayName || '',
      email: owner.email,
      phoneNumber: owner.phoneNumber,
      address: owner.address,
      profile_pic: null,
      bankDetails: owner.bankDetails || {
        accountNumber: '',
        bankName: '',
        branch: ''
      },
      status: owner.status,
      verified: owner.verified || false
    });

    if (owner.profile_pic) {
      setImagePreview(`http://localhost:5000${owner.profile_pic}?t=${Date.now()}`);
    } else {
      setImagePreview(null);
    }

    setIsEditing(true);
    setActiveTab('add');
  };

  const handleDelete = async (ownerId) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      try {
        setLoading(true);
        await deleteOwner(ownerId);
        setOwners(owners.filter(owner => owner._id !== ownerId));
        toast.success('Owner deleted successfully!');
        if (isEditing && formData._id === ownerId) {
          resetForm();
        }
      } catch (err) {
        toast.error('Failed to delete owner');
        console.error('Error deleting owner:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusToggle = async (ownerId) => {
    try {
      const owner = owners.find(o => o._id === ownerId);
      const newStatus = owner.status === "Active" ? "Blocked" : "Active";

      await updateOwnerStatus(ownerId, newStatus);
      setOwners(owners.map(owner =>
        owner._id === ownerId ? { ...owner, status: newStatus } : owner
      ));
    } catch (err) {
      toast.error('Failed to update owner status');
      console.error('Error updating owner status:', err);
    }
  };

  const handleViewProperties = (owner) => {
    setSelectedOwner(owner);
    setShowProperties(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      displayName: '',
      email: '',
      phoneNumber: '',
      address: '',
      profile_pic: null,
      bankDetails: {
        accountNumber: '',
        bankName: '',
        branch: ''
      },
      status: 'Active',
      verified: false
    });
    setImagePreview(null);
    setIsEditing(false);
    setIsUploading(false);
  };

  const calculateOwnerStats = () => {
    const totalOwners = owners.length;
    const activeOwners = owners.filter(owner => owner.status === "Active").length;
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

  if (loading) {
    return (
      <Loading text='Loading Admin Owner data...'/>
    );
  }

  return (
    <div className="owner-management-container">
      <h1 className="title">Owner Management</h1>

      {/* ------------ Navigation Tabs ------------ */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('add');
          }}
        >
          {isEditing ? 'Edit Owner' : 'Add Owner'}
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('view');
          }}
        >
          View All Owners
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('stats');
          }}
        >
          Statistics
        </button>
      </div>

      {/* ------------ Loading State ------------ */}
      {loading && <div className="loading">Loading...</div>}

      {/* ------------ Add/Edit Owner Form ------------ */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="owner-form" encType="multipart/form-data">
          {/* Owner Statistics Summary */}
          <div className="stats-summary">
            <div className="stat-card">
              <div>
                <h3>Total Owners</h3>
                <p>{ownerStats.totalOwners}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Active</h3>
                <p>{ownerStats.activeOwners}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Blocked</h3>
                <p>{ownerStats.blockedOwners}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>With Properties</h3>
                <p>{ownerStats.ownersWithProperties}</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Profile Picture</h2>
            <div className="profile-picture-upload">
              <div className="image-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile preview" className="preview-image" />
                ) : (
                  <div className="placeholder-image">
                    <i className="fas fa-user"></i>
                    <span>No image selected</span>
                  </div>
                )}
              </div>
              <div className="upload-controls">
                <label htmlFor="profile_pic" className="file-upload-label">
                  {isUploading ? 'Uploading...' : 'Choose Profile Picture'}
                </label>
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                {formData.profile_pic && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, profile_pic: null }));
                      setImagePreview(null);
                    }}
                    className="remove-image-btn"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

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
                <label>Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Will use first name if empty"
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
                  name="phoneNumber"
                  value={formData.phoneNumber}
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
                <label>Verified Owner</label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={formData.verified}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Verified
                </label>
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
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="status-select"
                >
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={loading || isUploading}
            >
              {loading ? 'Processing...' : isEditing ? 'Update Owner' : 'Add Owner'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="submit-button cancel-button"
                disabled={loading || isUploading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* ------------ View All Owners ------------ */}
      {activeTab === 'view' && (
        <div className="owners-list">
          <div className="list-header">
            <h2 className="section-title">All Owners ({filteredOwners.length})</h2>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading owners...</div>
          ) : filteredOwners.length === 0 ? (
            <div className="no-results">
              {searchTerm ? 'No owners found matching your search' : 'No owners found'}
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
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map(owner => (
                  <tr key={owner._id} className={owner.status === "Blocked" ? 'blocked' : ''}>
                    <td>
                      <img
                        src={owner.profile_pic
                          ? `http://localhost:5000${owner.profile_pic}?t=${Date.now()}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName)}&background=random&color=fff`
                        }
                        alt={owner.fullName}
                        className="owner-thumbnail"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName)}&background=random&color=fff`;
                        }}
                      />
                    </td>
                    <td>
                      <div>{owner._id}</div>
                    </td>
                    <td>
                      <div className="owner-name">{owner.fullName}</div>
                      <div className="small-text">{owner.displayName}</div>
                      <div className="small-text">{owner.email}</div>
                    </td>
                    <td>
                      <div>{owner.phoneNumber}</div>
                      <div className="small-text">{owner.address}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleStatusToggle(owner._id)}
                        className={`status-badge ${owner.status === "Blocked" ? 'blocked' : 'active'}`}
                      >
                        {owner.status}
                      </button>
                    </td>
                    <td>
                      <span className={`verified-badge ${owner.verified ? 'verified' : 'not-verified'}`}>
                        {owner.verified ? 'Verified' : 'Not Verified'}
                      </span>
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
                          onClick={() => handleDelete(owner._id)}
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

      {/* ------------ Statistics View ------------ */}
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
                      strokeDashoffset: 314 - (314 * (ownerStats.activeOwners / Math.max(ownerStats.totalOwners, 1)))
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {Math.round((ownerStats.activeOwners / Math.max(ownerStats.totalOwners, 1)) * 100)}%
                </div>
              </div>
              <p>{ownerStats.activeOwners} of {ownerStats.totalOwners} owners active</p>
            </div>

            <div className="stat-card">
              <h3>Total Owners</h3>
              <div className="big-number">{ownerStats.totalOwners}</div>
              <div className="stats-details">
                <div>Active: {ownerStats.activeOwners}</div>
                <div>Blocked: {ownerStats.blockedOwners}</div>
                <div>With Properties: {ownerStats.ownersWithProperties}</div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Owners with Properties</h3>
              <div className="big-number">{ownerStats.ownersWithProperties}</div>
              <p>{Math.round((ownerStats.ownersWithProperties / Math.max(ownerStats.totalOwners, 1)) * 100)}% of total</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Owner Status Distribution</h3>
            <div className="bar-chart">
              <div className="bar" style={{ height: `${(ownerStats.activeOwners / Math.max(ownerStats.totalOwners, 1)) * 100}%` }}>
                <div className="bar-label">Active</div>
                <div className="bar-value">{ownerStats.activeOwners}</div>
              </div>
              <div className="bar" style={{ height: `${(ownerStats.blockedOwners / Math.max(ownerStats.totalOwners, 1)) * 100}%` }}>
                <div className="bar-label">Blocked</div>
                <div className="bar-value">{ownerStats.blockedOwners}</div>
              </div>
              <div className="bar" style={{ height: `${(ownerStats.ownersWithProperties / Math.max(ownerStats.totalOwners, 1)) * 100}%` }}>
                <div className="bar-label">With Properties</div>
                <div className="bar-value">{ownerStats.ownersWithProperties}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------ Owner Properties Modal ------------ */}
      {showProperties && (
        <OwnerProperties
          owner={selectedOwner}
          onClose={() => {
            setShowProperties(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminOwner;