import { useState, useEffect } from 'react';
import { assets } from '../../Assets/assets';
import './AdminTransport.css';

const AdminTransport = () => {
  const [formData, setFormData] = useState({
    vehicle_name: '',
    vehicle_type: '',
    rental_price_per_day: '',
    description: '',
    features: [],
    customFeature: '',
    images: [],
    isAvailable: true,
    address: '',
    seating_capacity: 2,
    owner_id: '',
    status: 'Active',
    brand: '',
    model: '',
    fuel_type: 'Petrol',
    year: new Date().getFullYear(),
    registration_number: '',
    deposit_amount: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  // Load initial data
  useEffect(() => {
    fetchVehicles();
    fetchBookings();
    fetchOwners();
  }, []);

  // API Functions
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/transports`);
      const result = await response.json();
      if (result.success) {
        setVehicles(result.transports);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      alert('Error fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/transport-bookings`);
      const result = await response.json();
      if (result.success) {
        setBookings(result.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Error fetching bookings');
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await fetch(`${API_BASE}/owners`);
      const result = await response.json();
      if (result.success) {
        setOwners(result.owners);
        // Set default owner if available
        if (result.owners.length > 0 && !formData.owner_id) {
          setFormData(prev => ({ ...prev, owner_id: result.owners[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  // Standard features options
  const standardFeatures = [
    "Air Conditioning",
    "Automatic Transmission",
    "Manual Transmission",
    "Bluetooth Audio",
    "Navigation System",
    "Backup Camera",
    "Leather Seats",
    "Sunroof",
    "Alloy Wheels",
    "Hybrid Engine"
  ];

  // Vehicle statistics
  const calculateVehicleStats = () => {
    const totalVehicles = vehicles.length;
    const occupiedVehicles = vehicles.filter(vehicle => !vehicle.isAvailable).length;
    const availableVehicles = totalVehicles - occupiedVehicles;
    const averageRating = vehicles.length > 0
      ? vehicles.reduce((sum, vehicle) => sum + vehicle.averageRating, 0) / totalVehicles
      : 0;

    return {
      totalVehicles,
      occupiedVehicles,
      availableVehicles,
      averageRating: averageRating.toFixed(1),
    };
  };

  const vehicleStats = calculateVehicleStats();

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

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle feature toggle
  const toggleFeature = (feature) => {
    setFormData(prev => {
      const newFeatures = prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature];

      return {
        ...prev,
        features: newFeatures
      };
    });
  };

  // Add custom feature
  const addCustomFeature = () => {
    if (formData.customFeature.trim() && !formData.features.includes(formData.customFeature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, prev.customFeature],
        customFeature: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'images' && key !== 'customFeature') {
          submitData.append(key, formData[key]);
        }
      });

      // Append images
      imageFiles.forEach(file => {
        submitData.append('vehicle_images', file);
      });

      let response;
      if (editingId) {
        // Update existing vehicle
        response = await fetch(`${API_BASE}/transports/${editingId}`, {
          method: 'PUT',
          body: submitData,
        });
      } else {
        // Add new vehicle
        response = await fetch(`${API_BASE}/transports`, {
          method: 'POST',
          body: submitData,
        });
      }

      const result = await response.json();

      if (result.success) {
        alert(editingId ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
        await fetchVehicles();
        resetForm();
        setActiveTab('view');
      } else {
        alert(result.message || 'Error saving vehicle');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error saving vehicle');
    } finally {
      setLoading(false);
    }
  };

  // Toggle vehicle status between Active and Inactive
  const toggleVehicleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const response = await fetch(`${API_BASE}/transports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchVehicles();
      } else {
        alert(result.message || 'Error updating vehicle status');
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      alert('Error updating vehicle status');
    }
  };

  // Edit vehicle
  const handleEdit = (vehicle) => {
    setFormData({
      vehicle_name: vehicle.vehicle_name || `${vehicle.brand} ${vehicle.model}`,
      owner_id: vehicle.owner_id?._id || vehicle.owner_id,
      vehicle_type: vehicle.vehicle_type,
      rental_price_per_day: vehicle.rental_price_per_day,
      deposit_amount: vehicle.deposit_amount,
      features: vehicle.features || [],
      isAvailable: vehicle.isAvailable,
      address: vehicle.address,
      seating_capacity: vehicle.seating_capacity,
      description: vehicle.description || '',
      customFeature: '',
      brand: vehicle.brand,
      model: vehicle.model,
      fuel_type: vehicle.fuel_type,
      year: vehicle.year,
      registration_number: vehicle.registration_number,
      status: vehicle.status
    });

    // Set image previews from existing images
    if (vehicle.vehicle_images && vehicle.vehicle_images.length > 0) {
      setImagePreviews(vehicle.vehicle_images.map(img =>
        img.startsWith('http') ? img : `http://localhost:5000${img}`
      ));
    } else {
      setImagePreviews([]);
    }

    setImageFiles([]);
    setEditingId(vehicle._id);
    setActiveTab('add');
  };

  // Delete vehicle
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await fetch(`${API_BASE}/transports/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        if (result.success) {
          alert('Vehicle deleted successfully!');
          await fetchVehicles();
        } else {
          alert(result.message || 'Error deleting vehicle');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Error deleting vehicle');
      }
    }
  };

  // Toggle vehicle availability
  const toggleAvailability = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/transports/${id}/availability/toggle`, {
        method: 'PATCH',
      });

      const result = await response.json();
      if (result.success) {
        await fetchVehicles();
      } else {
        alert(result.message || 'Error updating availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Error updating availability');
    }
  };

  // Update booking status
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/transport-bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking_status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchBookings();
      } else {
        alert(result.message || 'Error updating booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      vehicle_name: '',
      vehicle_type: '',
      rental_price_per_day: '',
      description: '',
      features: [],
      customFeature: '',
      images: [],
      isAvailable: true,
      address: '',
      seating_capacity: 2,
      owner_id: owners[0]?._id || '',
      status: 'Active',
      brand: '',
      model: '',
      fuel_type: 'Petrol',
      year: new Date().getFullYear(),
      registration_number: '',
      deposit_amount: ''
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

  // Get vehicle display name
  const getVehicleDisplayName = (vehicle) => {
    return vehicle.vehicle_name || `${vehicle.brand} ${vehicle.model}`;
  };

  // Get owner display name
  const getOwnerDisplayName = (owner) => {
    if (typeof owner === 'object') {
      return owner.displayName || owner.fullName || 'N/A';
    }
    return 'N/A';
  };

  return (
    <div className="transport-container">
      {/* --------------------------- Page Title --------------------------- */}
      <h1 className="title">Transport & Bookings Management</h1>

      {/* ---------------------------  Navigation Tabs --------------------------- */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          {editingId ? 'Edit Vehicle' : 'Add Vehicle'}
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View All Vehicles
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

      {/*  ----------------- Add/Edit Vehicle Form --------------------------- */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="vehicle-form">
          {/* Vehicle Statistics Summary */}
          <div className="stats-summary">
            <div className="stat-card">
              <div>
                <h3>Total Vehicles</h3>
                <p>{vehicleStats.totalVehicles}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Occupied</h3>
                <p>{vehicleStats.occupiedVehicles}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Available</h3>
                <p>{vehicleStats.availableVehicles}</p>
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
            <h2 className='section-title '>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Vehicle Name</label>
                <input
                  name="vehicle_name"
                  value={formData.vehicle_name}
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
                <label>Vehicle Type</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Motorbike">Motorbike</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Truck">Truck</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Brand</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div className="form-group">
                <label>Registration Number</label>
                <input
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price Per Day (Rs)</label>
                <input
                  type="number"
                  name="rental_price_per_day"
                  value={formData.rental_price_per_day}
                  onChange={handleInputChange}
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
                  required
                />
              </div>

              <div className="form-group">
                <label>Seating Capacity</label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="20"
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
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter vehicle address..."
                  rows="2"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description of the vehicle..."
                  rows="2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="form-section">
            <h2 className='section-title '>Features</h2>
            <div className="features-grid">
              {standardFeatures.map((feature, index) => (
                <div key={index} className="feature-item">
                  <input
                    type="checkbox"
                    id={`feature-${index}`}
                    checked={formData.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  <label className='feature-label' htmlFor={`feature-${index}`}>{feature}</label>
                </div>
              ))}
            </div>

            <div className="custom-feature">
              <input
                type="text"
                value={formData.customFeature}
                onChange={(e) => setFormData({ ...formData, customFeature: e.target.value })}
                placeholder="Add custom feature"
              />
              <button type="button" onClick={addCustomFeature}>Add</button>
            </div>

            <div className="selected-features">
              {formData.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className="remove-feature"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Vehicle Images */}
          <div className="form-section">
            <h2 className='section-title '>Vehicle Images</h2>
            <div className="image-upload-container">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                id="vehicle-images"
                style={{ display: 'none' }}
              />
              <label htmlFor="vehicle-images" className="upload-button">
                Choose Images (4 recommended)
              </label>

              <div className="image-preview-grid">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Vehicle preview ${index}`} />
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
              {loading ? 'Saving...' : (editingId ? 'Update Vehicle' : 'Add Vehicle')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="submit-button"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* ----------------------------------- View All Vehicles -----------------------------------*/}
      {activeTab === 'view' && (
        <div className="vehicles-list">
          {/* Vehicles List Header */}
          <div className="list-header">
            <h2 className='section-title '>All Vehicles ({vehicles.length})</h2>
            <div className="search-filter">
              <input className='search-input' type="text" placeholder="Search vehicles..." />
              <select>
                <option>Filter by Type</option>
                <option value='Motorbike'>Motorbike</option>
                <option value='Car'>Car</option>
                <option value='Van'>Van</option>
                <option value='Scooter'>Scooter</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading vehicles...</div>
          ) : (
            <table className="vehicles-table">
              {/* Table Header */}
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Vehicle Name</th>
                  <th>Type</th>
                  <th>Price/Day</th>
                  <th>Owner</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className={`table-row ${vehicle.status}`}>
                    <td>
                      <img
                        src={vehicle.vehicle_images?.[0] ?
                          (vehicle.vehicle_images[0].startsWith('http') ?
                            vehicle.vehicle_images[0] :
                            `http://localhost:5000${vehicle.vehicle_images[0]}`)
                          : assets.defaultVehicle
                        }
                        alt={vehicle.vehicle_type}
                        className="vehicle-thumbnail"
                      />
                    </td>
                    <td>{vehicle._id}</td>
                    <td>{getVehicleDisplayName(vehicle)}</td>
                    <td>{vehicle.vehicle_type}</td>
                    <td>Rs {vehicle.rental_price_per_day}</td>
                    <td>{getOwnerDisplayName(vehicle.owner_id)}</td>
                    <td>
                      <button
                        onClick={() => toggleAvailability(vehicle._id)}
                        className={`status-badge ${vehicle.isAvailable ? 'available' : 'occupied'}`}
                      >
                        {vehicle.isAvailable ? 'Available' : 'Occupied'}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${vehicle.status === 'Inactive' ? 'blocked' : 'active'}`}
                        onClick={() => toggleVehicleStatus(vehicle._id, vehicle.status)}
                        style={{ cursor: 'pointer' }}
                      >
                        {vehicle.status || 'Active'}
                      </span>
                    </td>

                    <td className='flex'>
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="action-button edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle._id)}
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
        </div>
      )}

      {/* ----------------------------------- Bookings Management ----------------------------------- */}
      {activeTab === 'bookings' && (
        <div className="vehicles-list">
          {/* Bookings List Header */}
          <div className="list-header">
            <h2 className='section-title '>All Bookings ({bookings.length})</h2>
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
          <table className="vehicles-table">
            {/* Table Header */}
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Renter</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>
                    <div className='primary-text'>
                      {booking.transport ?
                        getVehicleDisplayName(booking.transport) :
                        'Vehicle not found'
                      }
                    </div>
                    <div className="secondary-text">
                      {booking.transport?.vehicle_type || ''}
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
        </div>
      )}

      {/* ----------------------------------- Statistics View ----------------------------------- */}
      {activeTab === 'stats' && (
        <div className="stats-view">
          {/* Statistics Overview */}
          <h2 className='section-title '>Management Statistics</h2>

          {/* Statistics Cards */}
          <div className="stats-cards">
            <div className="stat-card large">
              <h3>Occupancy Rate</h3>
              <div className="progress-circle">
                <svg>
                  <circle className="bg" cx="60" cy="60" r="50"></circle>
                  <circle
                    className="progress"
                    cx="60"
                    cy="60"
                    r="50"
                    style={{
                      strokeDashoffset: 314 - (314 * (vehicleStats.occupiedVehicles / Math.max(vehicleStats.totalVehicles, 1)))
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {Math.round((vehicleStats.occupiedVehicles / Math.max(vehicleStats.totalVehicles, 1)) * 100)}%
                </div>
              </div>
              <p>{vehicleStats.occupiedVehicles} of {vehicleStats.totalVehicles} vehicles occupied</p>
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

          {/* Vehicle Type Distribution */}
          <div className="chart-container">
            <h3>Vehicle Type Distribution</h3>
            <div className="bar-chart">
              {['Motorbike', 'Car', 'Van', 'Scooter', 'Bicycle', 'Truck', 'Other'].map(type => {
                const count = vehicles.filter(v => v.vehicle_type === type).length;
                const percentage = vehicles.length > 0 ? (count / vehicles.length) * 100 : 0;
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

export default AdminTransport;