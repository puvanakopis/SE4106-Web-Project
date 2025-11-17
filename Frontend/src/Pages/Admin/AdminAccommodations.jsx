import { useState, useEffect } from 'react';
import { assets } from '../../Assets/assets';
import './AdminAccommodations.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000/api';

const AdminAccommodations = () => {
  const [formData, setFormData] = useState({
    accommodation_name: '',
    accommodation_type: '',
    property_type: '',
    description: '',
    price_per_month: '',
    deposit_amount: '',
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: '',
    maxGuests: 2,
    address: '',
    location: {
      type: 'Point',
      coordinates: ['', ''],
      mapSrc: '',
      title: ''
    },
    amenities: [],
    customAmenity: '',
    isAvailable: true,
    status: 'Active',
    owner_id: ''
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

  // Standard amenities options
  const standardAmenities = [
    "WiFi",
    "Air Conditioning",
    "Heating",
    "Kitchen",
    "Washer",
    "Dryer",
    "Parking",
    "Pool",
    "Hot Tub",
    "Gym",
    "Elevator",
    "Wheelchair Accessible",
    "Security System",
    "Smoke Alarm",
    "Carbon Monoxide Alarm",
    "Fire Extinguisher",
    "First Aid Kit",
    "Essentials",
    "Shampoo",
    "Hair Dryer",
    "Iron",
    "TV",
    "Cable TV",
    "Netflix",
    "Workspace",
    "Balcony",
    "Garden",
    "BBQ Grill",
    "Pet Friendly",
    "Smoking Allowed"
  ];

  // Accommodation types
  const accommodationTypes = ["Single Bed", "Double Bed", "Other"]

  // Property types
  const propertyTypes = ["Hostel", "Apartment", "House", "Other"]

  // Status types
  const statusTypes = ["Active", "Blocked"];

  useEffect(() => {
    fetchAccommodations();
    fetchBookings();
    fetchOwners();
  }, []);

  // Get all accommodations
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/accommodations?limit=100`);
      const data = await response.json();

      if (data.success) {
        setAccommodations(data.accommodations);
      }
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      toast.error('Error loading accommodations');
    } finally {
      setLoading(false);
    }
  };

  // Get all bookings
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/accommodation-bookings`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    }
  };

  // Get all owners
  const fetchOwners = async () => {
    try {
      const response = await fetch(`${API_BASE}/owners`);
      const data = await response.json();

      if (data.success) {
        setOwners(data.owners || []);
        if (data.owners.length > 0 && !formData.owner_id) {
          setFormData(prev => ({ ...prev, owner_id: data.owners[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast.error('Error loading owners');
    }
  };

  // Create Accommodation
  const createAccommodation = async (accommodationData) => {
    try {
      const formData = new FormData();
      Object.keys(accommodationData).forEach(key => {
        if (key === 'amenities') {
          formData.append(key, JSON.stringify(accommodationData[key]));
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(accommodationData[key]));
        } else if (key !== 'accommodation_images' && key !== 'customAmenity') {
          formData.append(key, accommodationData[key]);
        }
      });

      imageFiles.forEach(file => {
        formData.append('accommodation_images', file);
      });

      const response = await fetch(`${API_BASE}/accommodations`, {
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

  // Update Accommodation
  const updateAccommodation = async (id, updateData) => {
    try {
      const formData = new FormData();

      Object.keys(updateData).forEach(key => {
        if (key === 'amenities') {
          formData.append(key, JSON.stringify(updateData[key]));
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(updateData[key]));
        } else if (key !== 'accommodation_images' && key !== 'customAmenity') {
          formData.append(key, updateData[key]);
        }
      });

      imageFiles.forEach(file => {
        formData.append('accommodation_images', file);
      });

      const response = await fetch(`${API_BASE}/accommodations/${id}`, {
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

  // Delete Accommodation
  const deleteAccommodation = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/accommodations/${id}`, {
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

  // Update Accommodation Status
  const updateAccommodationStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/accommodations/${id}/status`, {
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
    const occupiedAccommodations = accommodations.filter(acc => !acc.available).length;
    const availableAccommodations = totalAccommodations - occupiedAccommodations;
    const averageRating = accommodations.length > 0
      ? accommodations.reduce((sum, acc) => sum + (acc.averageRating || 0), 0) / totalAccommodations
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
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.paymentDetails?.paymentStatus === "completed" ? b.totalPrice : 0),
      0
    );
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
    toast.success(`${files.length} images uploaded successfully!`);
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

    try {
      const accommodationData = {
        ...formData,
        price_per_month: parseFloat(formData.price_per_month),
        deposit_amount: parseFloat(formData.deposit_amount),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: parseInt(formData.area_sqft),
        maxGuests: parseInt(formData.maxGuests),
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
        toast.success(editingId ? 'Accommodation updated successfully!' : 'Accommodation added successfully!');
        resetForm();
        setActiveTab('view');
      } else {
        toast.error(result.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit accommodation
  const handleEdit = (accommodation) => {
    setFormData({
      accommodation_name: accommodation.accommodation_name,
      accommodation_type: accommodation.accommodation_type,
      property_type: accommodation.property_type,
      description: accommodation.description || '',
      price_per_month: accommodation.price_per_month,
      deposit_amount: accommodation.deposit_amount,
      bedrooms: accommodation.bedrooms,
      bathrooms: accommodation.bathrooms,
      area_sqft: accommodation.area_sqft,
      maxGuests: accommodation.maxGuests,
      address: accommodation.address || '',
      location: {
        type: accommodation.location?.type || 'Point',
        coordinates: accommodation.location?.coordinates || ['', ''],
        mapSrc: accommodation.location?.mapSrc || '',
        title: accommodation.location?.title || ''
      },
      amenities: accommodation.amenities || [],
      isAvailable: accommodation.isAvailable,
      status: accommodation.status,
      owner_id: accommodation.owner_id?._id || accommodation.owner_id,
      customAmenity: '',
    });

    if (accommodation.accommodation_images && accommodation.accommodation_images.length > 0) {
      setImagePreviews(accommodation.accommodation_images.map(img =>
        img.startsWith('http') ? img : `http://localhost:5000${img}`
      ));
    } else {
      setImagePreviews([]);
    }

    setImageFiles([]);
    setEditingId(accommodation._id);
    setActiveTab('add');
    toast.info('Editing accommodation: ' + (accommodation.accommodation_name || `${accommodation.accommodation_type}`));
  };

  // Delete accommodation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this accommodation?')) {
      setLoading(true);
      const result = await deleteAccommodation(id);
      if (!result.success) {
        toast.error(result.message || 'Failed to delete accommodation');
      } else {
        toast.success('Accommodation deleted successfully!');
      }
      setLoading(false);
    }
  };

  // Toggle accommodation status
  const toggleAccommodationStatus = async (id, currentStatus) => {
    setLoading(true);
    let newStatus;

    // Cycle through statuses
    if (currentStatus === 'Active') {
      newStatus = 'Blocked';
    } else {
      newStatus = 'Active';
    }

    const result = await updateAccommodationStatus(id, newStatus);
    if (!result.success) {
      toast.error(result.message || 'Failed to update accommodation status');
    } else {
      toast.success(`Accommodation status updated to ${newStatus}`);
    }
    setLoading(false);
  };

  // Update booking status
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/accommodation-bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking_status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBookings();
        toast.success(`Booking status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      accommodation_name: '',
      accommodation_type: '',
      property_type: '',
      description: '',
      price_per_month: '',
      deposit_amount: '',
      bedrooms: 1,
      bathrooms: 1,
      area_sqft: '',
      maxGuests: 2,
      address: '',
      location: {
        type: 'Point',
        coordinates: ['', ''],
        mapSrc: '',
        title: ''
      },
      amenities: [],
      customAmenity: '',
      isAvailable: true,
      status: 'Active',
      owner_id: owners[0]?._id || ''
    });
    setImagePreviews([]);
    setImageFiles([]);
    setEditingId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get accommodation display name
  const getAccommodationDisplayName = (accommodation) => {
    return accommodation.accommodation_name || `${accommodation.accommodation_type}`;
  };

  // Get owner display name
  const getOwnerDisplayName = (owner) => {
    if (typeof owner === 'object') {
      return owner.displayName || owner.fullName || 'N/A';
    }
    return 'N/A';
  };

  // Remove image preview
  const removeImagePreview = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  // ----------------------- Render Method -----------------------
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="accommodations-container">
      {/* Page Title */}
      <h1 className="title">Accommodations & Bookings Management</h1>

      {/* ----------------- Navigation Tabs ----------------- */}
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

      {/* ----------------- Add/Edit Accommodation Form ----------------- */}
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
                  name="accommodation_name"
                  value={formData.accommodation_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Luxury Apartment, Cozy Studio"
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
                  name="accommodation_type"
                  value={formData.accommodation_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {accommodationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Property Type</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>



              <div className="form-group">
                <label>Price Per Month (Rs)</label>
                <input
                  type="number"
                  name="price_per_month"
                  value={formData.price_per_month}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Deposit Amount (Rs)</label>
                <input
                  type="number"
                  name="deposit_amount"
                  value={formData.deposit_amount}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div className="form-group">
                <label>Max Guests</label>
                <input
                  type="number"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  required
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

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {statusTypes.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter accommodation full address..."
                  rows="2"
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
                Choose Images (6 recommended)
              </label>

              <div className="image-preview-grid">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Accommodation preview ${index}`} />
                    <button
                      type="button"
                      onClick={() => removeImagePreview(index)}
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

      {/* ----------------- View All Accommodations ----------------- */}
      {activeTab === 'view' && (
        <div className="accommodations-list">
          {/* Accommodations List Header */}
          <div className="list-header">
            <h2 className='section-title'>All Accommodations ({accommodations.length})</h2>
            <div className="search-filter">
              <input className='search-input' type="text" placeholder="Search accommodations..." />
              <select>
                <option>Filter by Type</option>
                {accommodationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
                  <th>Bed/Bath</th>
                  <th>Price/Month</th>
                  <th>Owner</th>
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
                        src={accommodation.accommodation_images?.[0] ?
                          (accommodation.accommodation_images[0].startsWith('http') ?
                            accommodation.accommodation_images[0] :
                            `http://localhost:5000${accommodation.accommodation_images[0]}`)
                          : assets.defaultAccommodation
                        }
                        alt={getAccommodationDisplayName(accommodation)}
                        className="accommodation-thumbnail"
                      />
                    </td>
                    <td>{accommodation._id}</td>
                    <td>{getAccommodationDisplayName(accommodation)}</td>
                    <td>{accommodation.accommodation_type}</td>
                    <td>{accommodation.bedrooms} Beds / {accommodation.bathrooms} Baths</td>
                    <td>Rs {accommodation.price_per_month}</td>
                    <td>{getOwnerDisplayName(accommodation.owner_id)}</td>
                    <td>
                      <button
                        className={`status-badge ${accommodation.available === "Available" ? 'available' : 'occupied'}`}
                      >
                        {accommodation.available}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${accommodation.status === 'Active' ? 'active' : 'blocked'}`}
                        onClick={() => toggleAccommodationStatus(accommodation._id, accommodation.status)}
                        style={{ cursor: 'pointer' }}
                      >
                        {accommodation.status}
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

      {/* ----------------- Bookings Management ----------------- */}
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
                <th>Guests</th>
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
                        getAccommodationDisplayName(booking.accommodation) :
                        'Accommodation not found'
                      }
                    </div>
                    <div className="secondary-text">
                      {booking.accommodation?.accommodation_type || ''}
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
                  <td className='primary-text'>{booking.numberOfGuests} guests</td>
                  <td className='primary-text'>Rs {booking.totalPrice}</td>
                  <td>
                    <span
                      className={`payment-status ${booking.paymentDetails?.paymentStatus === "completed"
                        ? "paid"
                        : booking.paymentDetails?.paymentStatus === "refunded"
                          ? "refunded"
                          : "pending"
                        }`}
                    >
                      {booking.paymentDetails?.paymentStatus === "completed"
                        ? "Paid"
                        : booking.paymentDetails?.paymentStatus === "refunded"
                          ? "Refunded"
                          : "Pending"}
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
              {accommodationTypes.map(type => {
                const count = accommodations.filter(a => a.accommodation_type === type).length;
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

          {/* Property Type Distribution */}
          <div className="chart-container">
            <h3>Property Type Distribution</h3>
            <div className="bar-chart">
              {propertyTypes.map(type => {
                const count = accommodations.filter(a => a.property_type === type).length;
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