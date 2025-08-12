import React, { useState } from 'react';
import './AdminOwner.css';
import OwnerProperties from './AdminOwnerProperties';
import { ownerData as initialOwnerData, roomsData } from '../../Assets/assets';

const AdminOwner = () => {
  const [owners, setOwners] = useState([...initialOwnerData]);

  // State for form
  const [formData, setFormData] = useState({
    id: '',
    FullName: '',
    DisplayName: '',
    email: '',
    PhoneNumber: '',
    Address: '',
    profile_pic: null,
    bankDetails: {
      accountNumber: '',
      bankName: '',
      branch: ''
    },
    Status: 'Active',
    verified: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('add');

  // Filter owners based on search term
  const filteredOwners = owners.filter(owner =>
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.PhoneNumber.includes(searchTerm)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.FullName || !formData.email || !formData.PhoneNumber || !formData.Address) {
      setError('Full Name, Email, Phone and Address are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Create profile picture URL if not provided
    const currentOwner = isEditing ? owners.find(o => o.id === formData.id) : null;
    const profilePicUrl = formData.profile_pic
      ? URL.createObjectURL(formData.profile_pic)
      : (isEditing
        ? currentOwner?.profile_pic
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.FullName)}&background=random&color=fff`);

    if (isEditing) {
      // Update existing owner
      const updatedOwners = owners.map(owner =>
        owner.id === formData.id ? {
          ...owner,
          FullName: formData.FullName,
          DisplayName: formData.DisplayName || formData.FullName.split(' ')[0],
          email: formData.email,
          PhoneNumber: formData.PhoneNumber,
          Address: formData.Address,
          profile_pic: profilePicUrl,
          bankDetails: formData.bankDetails,
          Status: formData.Status,
          verified: formData.verified
        } : owner
      );
      setOwners(updatedOwners);
      setSuccess('Owner updated successfully!');
    } else {
      // Add new owner
      const newId = `owner_${owners.length + 1}`.padStart(3, '0');
      const newOwner = {
        id: newId,
        FullName: formData.FullName,
        DisplayName: formData.DisplayName || formData.FullName.split(' ')[0],
        email: formData.email,
        PhoneNumber: formData.PhoneNumber,
        Address: formData.Address,
        role: "Owner",
        profile_pic: profilePicUrl,
        bankDetails: formData.bankDetails,
        verified: formData.verified,
        Status: "Active",
        totalReviews: 0,
        averageRating: 0,
        ratingCount: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
        creatDate: new Date().toISOString().split('T')[0]
      };
      setOwners([...owners, newOwner]);
      setSuccess('Owner added successfully!');
    }

    // Reset form
    resetForm();
  };

  const handleEdit = (owner) => {
    setFormData({
      id: owner.id,
      FullName: owner.FullName,
      DisplayName: owner.DisplayName,
      email: owner.email,
      PhoneNumber: owner.PhoneNumber,
      Address: owner.Address,
      profile_pic: null,
      bankDetails: owner.bankDetails || {
        accountNumber: '',
        bankName: '',
        branch: ''
      },
      Status: owner.Status,
      verified: owner.verified || false
    });
    setIsEditing(true);
    setActiveTab('add');
  };

  const handleDelete = (ownerId) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      setOwners(owners.filter(owner => owner.id !== ownerId));
      setSuccess('Owner deleted successfully!');
      if (isEditing && formData.id === ownerId) {
        resetForm();
      }
    }
  };

  const handleStatusToggle = (ownerId) => {
    setOwners(owners.map(owner =>
      owner.id === ownerId
        ? { ...owner, Status: owner.Status === "Active" ? "Blocked" : "Active" }
        : owner
    ));
    setSuccess(`Owner ${owners.find(o => o.id === ownerId).Status === "Active" ? 'blocked' : 'activated'} successfully!`);
  };

  const handleViewProperties = (owner) => {
    setSelectedOwner(owner);
    setShowProperties(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      FullName: '',
      DisplayName: '',
      email: '',
      PhoneNumber: '',
      Address: '',
      profile_pic: null,
      bankDetails: {
        accountNumber: '',
        bankName: '',
        branch: ''
      },
      Status: 'Active',
      verified: false
    });
    setIsEditing(false);
    setIsUploading(false);
  };

  // Owner statistics
  const calculateOwnerStats = () => {
    const totalOwners = owners.length;
    const activeOwners = owners.filter(owner => owner.Status === "Active").length;
    const blockedOwners = totalOwners - activeOwners;
    const ownersWithProperties = owners.filter(owner =>
      roomsData.some(room => room.owner.id === owner.id)
    ).length;

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
          onClick={() => setActiveTab('view')}
        >
          View All Owners
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
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

          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name*</label>
                <input
                  type="text"
                  name="FullName"
                  value={formData.FullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  name="DisplayName"
                  value={formData.DisplayName}
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
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address*</label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Profile Picture {isUploading && '(Uploading...)'}</label>
                <input
                  type="file"
                  name="profile_pic"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {isEditing && !formData.profile_pic && (
                  <div className="small-text">
                    Current: {owners.find(o => o.id === formData.id)?.profile_pic ? 'Image uploaded' : 'Using default avatar'}
                  </div>
                )}
              </div>

                <div className="form-group">
                  <label>Verified Owner</label>
                  <select
                    name="verified"
                    value={formData.verified ? "yes" : "no"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verified: e.target.value === "yes"
                      })
                    }
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
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
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  className="status-select"
                >
                  <option value="Active">Active</option>
                  <option value="Block">Block</option>
                </select>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map(owner => (
                  <tr key={owner.id} className={owner.Status === "Blocked" ? 'blocked' : ''}>
                    <td>
                      <img
                        src={owner.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.FullName)}&background=random&color=fff`}
                        alt={owner.FullName}
                        className="owner-thumbnail"
                      />
                    </td>
                    <td>
                      <div>{owner.id}</div>
                    </td>
                    <td>
                      <div className="owner-name">{owner.FullName}</div>
                      <div className="small-text">{owner.DisplayName}</div>
                      <div className="small-text">{owner.email}</div>
                    </td>
                    <td>
                      <div>{owner.PhoneNumber}</div>
                      <div className="small-text">{owner.Address}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleStatusToggle(owner.id)}
                        className={`status-badge ${owner.Status === "Blocked" ? 'blocked' : 'active'}`}
                      >
                        {owner.Status}
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
                      strokeDashoffset: 314 - (314 * (ownerStats.activeOwners / ownerStats.totalOwners))
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {Math.round((ownerStats.activeOwners / ownerStats.totalOwners) * 100)}%
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
              <p>{Math.round((ownerStats.ownersWithProperties / ownerStats.totalOwners) * 100)}% of total</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Owner Status Distribution</h3>
            <div className="bar-chart">
              <div className="bar" style={{ height: `${(ownerStats.activeOwners / ownerStats.totalOwners) * 100}%` }}>
                <div className="bar-label">Active</div>
                <div className="bar-value">{ownerStats.activeOwners}</div>
              </div>
              <div className="bar" style={{ height: `${(ownerStats.blockedOwners / ownerStats.totalOwners) * 100}%` }}>
                <div className="bar-label">Blocked</div>
                <div className="bar-value">{ownerStats.blockedOwners}</div>
              </div>
              <div className="bar" style={{ height: `${(ownerStats.ownersWithProperties / ownerStats.totalOwners) * 100}%` }}>
                <div className="bar-label">With Properties</div>
                <div className="bar-value">{ownerStats.ownersWithProperties}</div>
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