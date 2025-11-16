import { useState, useEffect } from 'react';
import { assets } from '../../Assets/assets';
import './AdminAccommodations.css';

const API_BASE_URL = 'http://localhost:5000/api';

const AdminAccommodations = () => {
  // State for form inputs - updated with all model fields
  const [formData, setFormData] = useState({
    owner_id: '',
    accommodationName: '',
    accommodationType: '',
    pricePerMonth: '',
    SecurityDeposit: '',
    description: '',
    amenities: [],
    customAmenity: '',
    images: [],
    isAvailable: true,
    noOfBed: 1,
    status: 'Active',
    address: '',
    location: {
      type: 'Point',
      coordinates: ['', ''],
      mapSrc: '',
      title: ''
    }
  });

  const [accommodations, setAccommodations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Standard amenities options
  const standardAmenities = [
    "Wi-Fi",
    "Study Table",
    "Laundry Service",
    "Shared Kitchen",
    "24/7 Water",
    "Hot Water",
    "Fan",
    "Balcony",
    "Attached Bathroom",
    "Meal Plan"
  ];

  // Fetch accommodations and owners on component mount
  useEffect(() => {
    fetchAccommodations();
    fetchOwners();
    fetchBookings();
  }, []);

  // API Functions
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/accommodations?limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setAccommodations(data.accommodations);
      } else {
        setError('Failed to fetch accommodations');
      }
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      setError('Failed to fetch accommodations');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/owners`);
      const data = await response.json();
      
      if (data.success) {
        setOwners(data.owners || []);
        // Set default owner if available
        if (data.owners.length > 0 && !formData.owner_id) {
          setFormData(prev => ({ ...prev, owner_id: data.owners[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/accommodation-bookings`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const createAccommodation = async (accommodationData) => {
    try {
      const formData = new FormData();
      
      // Append all fields
      Object.keys(accommodationData).forEach(key => {
        if (key === 'amenities') {
          formData.append(key, JSON.stringify(accommodationData[key]));
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(accommodationData[key]));
        } else if (key !== 'images' && key !== 'customAmenity') {
          formData.append(key, accommodationData[key]);
        }
      });

      // Append images
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_BASE_URL}/accommodations`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAccommodations();
        return { success: true, data: data.accommodation };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error creating accommodation:', error);
      return { success: false, message: 'Failed to create accommodation' };
    }
  };

  const updateAccommodation = async (id, updateData) => {
    try {
      const formData = new FormData();
      
      // Append all fields
      Object.keys(updateData).forEach(key => {
        if (key === 'amenities') {
          formData.append(key, JSON.stringify(updateData[key]));
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(updateData[key]));
        } else if (key !== 'images' && key !== 'customAmenity') {
          formData.append(key, updateData[key]);
        }
      });

      // Append new images if any
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_BASE_URL}/accommodations/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAccommodations();
        return { success: true, data: data.accommodation };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating accommodation:', error);
      return { success: false, message: 'Failed to update accommodation' };
    }
  };

  const deleteAccommodation = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accommodations/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAccommodations();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      return { success: false, message: 'Failed to delete accommodation' };
    }
  };

  const toggleAccommodationAvailability = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accommodations/${id}/availability/toggle`, {
        method: 'PATCH',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAccommodations();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      return { success: false, message: 'Failed to toggle availability' };
    }
  };

  const updateAccommodationStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accommodations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAccommodations();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, message: 'Failed to update status' };
    }
  };

  // Accommodation statistics
  const calculateAccommodationStats = () => {
    const totalAccommodations = accommodations.length;
    const occupiedAccommodations = accommodations.filter(accommodation => !accommodation.isAvailable).length;
    const availableAccommodations = totalAccommodations - occupiedAccommodations;
    const averageRating = accommodations.length > 0 
      ? accommodations.reduce((sum, accommodation) => sum + (accommodation.averageRating || 0), 0) / totalAccommodations
      : 0;

    return {
      totalAccommodations,
      occupiedAccommodations,
      availableAccommodations,
      averageRating: averageRating.toFixed(1),
    };
  };

  const accommodationStats = calculateAccommodationStats();

  // Booking statistics
  const calculateBookingStats = () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.booking_status === 'confirmed').length;
    const cancelledBookings = bookings.filter(b => b.booking_status === 'cancelled').length;
    const completedBookings = bookings.filter(b => b.booking_status === 'completed').length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.isPaid ? booking.totalPrice : 0), 0);

    return {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue
    };
  };

  const bookingStats = calculateBookingStats();

  // Filter bookings by status
  const filteredBookings = bookingStatusFilter === 'all'
    ? bookings
    : bookings.filter(booking => booking.booking_status === bookingStatusFilter);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle location input changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  // Handle coordinates change
  const handleCoordinatesChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: prev.location.coordinates.map((coord, i) => 
          i === index ? parseFloat(value) || '' : coord
        )
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle amenity toggle
  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];

      return {
        ...prev,
        amenities: newAmenities
      };
    });
  };

  // Add custom amenity
  const addCustomAmenity = () => {
    if (formData.customAmenity.trim() && !formData.amenities.includes(formData.customAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, prev.customAmenity],
        customAmenity: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const accommodationData = {
        ...formData,
        pricePerMonth: parseFloat(formData.pricePerMonth),
        SecurityDeposit: parseFloat(formData.SecurityDeposit) || 0,
        noOfBed: parseInt(formData.noOfBed),
        isAvailable: formData.isAvailable === 'true' || formData.isAvailable === true,
        location: {
          ...formData.location,
          coordinates: formData.location.coordinates.map(coord => parseFloat(coord) || 0)
        }
      };

      let result;
      if (editingId) {
        result = await updateAccommodation(editingId, accommodationData);
      } else {
        result = await createAccommodation(accommodationData);
      }

      if (result.success) {
        alert(editingId ? 'Accommodation updated successfully!' : 'Accommodation added successfully!');
        resetForm();
        setActiveTab('view');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  // Edit accommodation
  const handleEdit = (accommodation) => {
    setFormData({
      owner_id: accommodation.owner_id?._id || accommodation.owner_id,
      accommodationName: accommodation.accommodationName,
      accommodationType: accommodation.accommodationType,
      pricePerMonth: accommodation.pricePerMonth,
      SecurityDeposit: accommodation.SecurityDeposit,
      amenities: accommodation.amenities || [],
      isAvailable: accommodation.isAvailable,
      noOfBed: accommodation.noOfBed,
      description: accommodation.description || '',
      status: accommodation.status,
      address: accommodation.address || '',
      location: {
        type: accommodation.location?.type || 'Point',
        coordinates: accommodation.location?.coordinates || ['', ''],
        mapSrc: accommodation.location?.mapSrc || '',
        title: accommodation.location?.title || ''
      },
      customAmenity: '',
    });

    // Set image previews from existing images
    if (accommodation.images && accommodation.images.length > 0) {
      setImagePreviews(accommodation.images.map(img =>
        img.startsWith('http') ? img : `http://localhost:5000${img}`
      ));
    } else {
      setImagePreviews([]);
    }

    setImageFiles([]);
    setEditingId(accommodation._id);
    setActiveTab('add');
  };

  // Delete accommodation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this accommodation?')) {
      setLoading(true);
      const result = await deleteAccommodation(id);
      if (!result.success) {
        setError(result.message);
      } else {
        alert('Accommodation deleted successfully!');
      }
      setLoading(false);
    }
  };

  // Toggle accommodation availability
  const toggleAvailability = async (id) => {
    setLoading(true);
    const result = await toggleAccommodationAvailability(id);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  // Toggle accommodation status between Active and Blocked
  const toggleAccommodationStatus = async (id, currentStatus) => {
    setLoading(true);
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    const result = await updateAccommodationStatus(id, newStatus);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  // Update booking status
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accommodation-bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking_status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBookings();
      } else {
        setError('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      owner_id: owners[0]?._id || '',
      accommodationName: '',
      accommodationType: '',
      pricePerMonth: '',
      SecurityDeposit: '',
      description: '',
      amenities: [],
      customAmenity: '',
      images: [],
      isAvailable: true,
      noOfBed: 1,
      status: 'Active',
      address: '',
      location: {
        type: 'Point',
        coordinates: ['', ''],
        mapSrc: '',
        title: ''
      }
    });
    setImagePreviews([]);
    setImageFiles([]);
    setEditingId(null);
    setError('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate security deposit based on accommodation type
  const calculateSecurityDeposit = (type) => {
    switch (type) {
      case 'Single Bed': return 10000;
      case 'Double Bed': return 15000;
      case 'Triple Sharing': return 20000;
      case 'Annexe': return 25000;
      default: return 0;
    }
  };

  // Update security deposit when accommodation type changes
  useEffect(() => {
    if (formData.accommodationType) {
      setFormData(prev => ({
        ...prev,
        SecurityDeposit: calculateSecurityDeposit(prev.accommodationType)
      }));
    }
  }, [formData.accommodationType]);

  // Get owner display name
  const getOwnerDisplayName = (owner) => {
    if (typeof owner === 'object') {
      return owner.displayName || owner.fullName || 'N/A';
    }
    return 'N/A';
  };

  return (
    <div className="accommodations-container">
      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      {/* Page Title */}
      <h1 className="title">Accommodations & Bookings Management</h1>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          {editingId ? 'Edit Accommodation' : 'Add Accommodation'}
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View All Accommodations
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>

      {/* Add/Edit Accommodation Form */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="accommodation-form">
          {/* Accommodation Statistics Summary */}
          <div className="stats-summary">
            <div className="stat-card">
              <div>
                <h3>Total Accommodations</h3>
                <p>{accommodationStats.totalAccommodations}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Occupied</h3>
                <p>{accommodationStats.occupiedAccommodations}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Available</h3>
                <p>{accommodationStats.availableAccommodations}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Total Revenue</h3>
                <p>Rs {bookingStats.totalRevenue}</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h2 className='section-title'>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Accommodation Name</label>
                <input
                  name="accommodationName"
                  value={formData.accommodationName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Owner</label>
                <select
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map(owner => (
                    <option key={owner._id} value={owner._id}>
                      {getOwnerDisplayName(owner)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Accommodation Type</label>
                <select
                  name="accommodationType"
                  value={formData.accommodationType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Accommodation Type</option>
                  <option value="Single Bed">Single Bed</option>
                  <option value="Double Bed">Double Bed</option>
                  <option value="Triple Sharing">Triple Sharing</option>
                  <option value="Annexe">Annexe</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price Per Month (Rs)</label>
                <input
                  type="number"
                  name="pricePerMonth"
                  value={formData.pricePerMonth}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Security Deposit (Rs)</label>
                <input
                  type="number"
                  name="SecurityDeposit"
                  value={formData.SecurityDeposit}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>No of Beds</label>
                <input
                  type="number"
                  name="noOfBed"
                  value={formData.noOfBed}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label>Availability</label>
                <select
                  name="isAvailable"
                  value={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                  required
                >
                  <option value="true">Available</option>
                  <option value="false">Occupied</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description of the accommodation..."
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h2 className='section-title'>Location Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Location Title</label>
                <input
                  name="title"
                  value={formData.location.title}
                  onChange={handleLocationChange}
                  placeholder="e.g., City Center, Near University"
                />
              </div>

              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.location.coordinates[0] || ''}
                  onChange={(e) => handleCoordinatesChange(0, e.target.value)}
                  placeholder="e.g., 27.7172"
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.location.coordinates[1] || ''}
                  onChange={(e) => handleCoordinatesChange(1, e.target.value)}
                  placeholder="e.g., 85.3240"
                />
              </div>

              <div className="form-group full-width">
                <label>Map Source URL</label>
                <input
                  name="mapSrc"
                  value={formData.location.mapSrc}
                  onChange={handleLocationChange}
                  placeholder="Embedded map URL (optional)"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h2 className='section-title'>Amenities</h2>
            <div className="amenities-grid">
              {standardAmenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <input
                    type="checkbox"
                    id={`amenity-${index}`}
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  <label className='amenity-label' htmlFor={`amenity-${index}`}>{amenity}</label>
                </div>
              ))}
            </div>

            <div className="custom-amenity">
              <input
                type="text"
                value={formData.customAmenity}
                onChange={(e) => setFormData({ ...formData, customAmenity: e.target.value })}
                placeholder="Add custom amenity"
              />
              <button type="button" onClick={addCustomAmenity}>Add</button>
            </div>

            <div className="selected-amenities">
              {formData.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className="remove-amenity"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Accommodation Images */}
          <div className="form-section">
            <h2 className='section-title'>Accommodation Images</h2>
            <div className="image-upload-container">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                id="accommodation-images"
                style={{ display: 'none' }}
              />
              <label htmlFor="accommodation-images" className="upload-button">
                Choose Images (4 recommended)
              </label>

              <div className="image-preview-grid">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Accommodation preview ${index}`} />
                    <button
                      type="button"
                      onClick={() => {
                        const newPreviews = [...imagePreviews];
                        newPreviews.splice(index, 1);
                        setImagePreviews(newPreviews);

                        const newFiles = [...imageFiles];
                        newFiles.splice(index, 1);
                        setImageFiles(newFiles);
                      }}
                      className="remove-image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Saving...' : (editingId ? 'Update Accommodation' : 'Add Accommodation')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* View All Accommodations */}
      {activeTab === 'view' && (
        <div className="accommodations-list">
          {/* Accommodations List Header */}
          <div className="list-header">
            <h2 className='section-title'>All Accommodations ({accommodations.length})</h2>
            <div className="search-filter">
              <input className='search-input' type="text" placeholder="Search accommodations..." />
              <select>
                <option>Filter by Type</option>
                <option value='Single Bed'>Single Bed</option>
                <option value='Double Bed'>Double Bed</option>
                <option value='Triple Sharing'>Triple Sharing</option>
                <option value='Annexe'>Annexe</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading accommodations...</div>
          ) : (
            <table className="accommodations-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Accommodation Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Owner</th>
                  <th>Address</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {accommodations.map((accommodation) => (
                  <tr key={accommodation._id} className={`table-row ${accommodation.status}`}>
                    <td>
                      <img
                        src={accommodation.images?.[0] ?
                          (accommodation.images[0].startsWith('http') ?
                            accommodation.images[0] :
                            `http://localhost:5000${accommodation.images[0]}`)
                          : assets.defaultAccommodation
                        }
                        alt={accommodation.accommodationName}
                        className="accommodation-thumbnail"
                      />
                    </td>
                    <td>{accommodation._id}</td>
                    <td>{accommodation.accommodationName}</td>
                    <td>{accommodation.accommodationType}</td>
                    <td>Rs {accommodation.pricePerMonth}</td>
                    <td>{getOwnerDisplayName(accommodation.owner_id)}</td>
                    <td className="address-cell">
                      {accommodation.address ? (
                        <span title={accommodation.address}>
                          {accommodation.address.length > 30 
                            ? `${accommodation.address.substring(0, 30)}...` 
                            : accommodation.address
                          }
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleAvailability(accommodation._id)}
                        className={`status-badge ${accommodation.isAvailable ? 'available' : 'occupied'}`}
                      >
                        {accommodation.isAvailable ? 'Available' : 'Occupied'}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${accommodation.status === 'Blocked' ? 'blocked' : 'active'}`}
                        onClick={() => toggleAccommodationStatus(accommodation._id, accommodation.status)}
                        style={{ cursor: 'pointer' }}
                      >
                        {accommodation.status || 'Active'}
                      </span>
                    </td>

                    <td className='flex'>
                      <button
                        onClick={() => handleEdit(accommodation)}
                        className="action-button edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(accommodation._id)}
                        className="action-button delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {accommodations.length === 0 && !loading && (
            <div className="no-data">
              No accommodations found
            </div>
          )}
        </div>
      )}

      {/* Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="accommodations-list">
          {/* Bookings List Header */}
          <div className="list-header">
            <h2 className='section-title'>All Bookings ({bookings.length})</h2>
            <div className="search-filter">
              <input type="text" placeholder="Search bookings..." />
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <table className="accommodations-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Accommodation</th>
                <th>Renter</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>
                    <div className='primary-text'>
                      {booking.accommodation ?
                        booking.accommodation.accommodationName :
                        'Accommodation not found'
                      }
                    </div>
                    <div className="secondary-text">
                      {booking.accommodation?.accommodationType || ''}
                    </div>
                  </td>
                  <td>
                    <div className='primary-text'>
                      {booking.renter?.fullName || 'N/A'}
                    </div>
                    <div className="secondary-text">
                      {booking.renter?.email || ''}
                    </div>
                  </td>
                  <td>
                    <div className='primary-text'>{formatDate(booking.booking_start)}</div>
                    <div className="secondary-text">to {formatDate(booking.booking_end)}</div>
                  </td>
                  <td className='primary-text'>Rs {booking.totalPrice}</td>
                  <td>
                    <span className={`payment-status ${booking.isPaid ? 'paid' : 'unpaid'}`}>
                      {booking.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${booking.booking_status}`}>
                      {booking.booking_status}
                    </span>
                  </td>

                  <td>
                    <select
                      value={booking.booking_status}
                      onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="no-data">
              No bookings found
            </div>
          )}
        </div>
      )}

      {/* Statistics View */}
      {activeTab === 'stats' && (
        <div className="stats-view">
          <h2 className='section-title'>Management Statistics</h2>

          {/* Statistics Cards */}
          <div className="stats-cards">
            <div className="stat-card large">
              <h3>Occupancy Rate</h3>
              <div className="progress-circle">
                <svg>
                  <circle className="bg" cx="60" cy="60" r="50"></circle>
                  <circle
                    className="progress"
                    cx="60" cy="60" r="50"
                    style={{
                      strokeDashoffset: 314 - (314 * (accommodationStats.occupiedAccommodations / Math.max(accommodationStats.totalAccommodations, 1)))
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {Math.round((accommodationStats.occupiedAccommodations / Math.max(accommodationStats.totalAccommodations, 1)) * 100)}%
                </div>
              </div>
              <p>{accommodationStats.occupiedAccommodations} of {accommodationStats.totalAccommodations} accommodations occupied</p>
            </div>

            <div className="stat-card">
              <h3>Total Bookings</h3>
              <div className="big-number">{bookingStats.totalBookings}</div>
              <div className="booking-stats">
                <div>Confirmed: {bookingStats.confirmedBookings}</div>
                <div>Cancelled: {bookingStats.cancelledBookings}</div>
                <div>Completed: {bookingStats.completedBookings}</div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Revenue</h3>
              <div className="big-number">Rs {bookingStats.totalRevenue}</div>
              <p>From all bookings</p>
            </div>
          </div>

          {/* Accommodation Type Distribution */}
          <div className="chart-container">
            <h3>Accommodation Type Distribution</h3>
            <div className="bar-chart">
              {['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'].map(type => {
                const count = accommodations.filter(r => r.accommodationType === type).length;
                const percentage = accommodations.length > 0 ? (count / accommodations.length) * 100 : 0;
                return (
                  <div key={type} className="bar" style={{ height: `${percentage}%` }}>
                    <div className="bar-label">{type}</div>
                    <div className="bar-value">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccommodations;