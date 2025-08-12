import { useState, useEffect } from 'react';
import { assets } from '../../Assets/assets';
import { vehicleData, ownerData, upcomingBookings, pastBookings } from '../../Assets/assets';
import './AdminTransport.css';

const AdminTransport = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    _id: '',
    vehicleName: '',
    vehicleType: '',
    rentalPricePerDay: '',
    description: '',
    features: [],
    customFeature: '',
    images: [],
    isAvailable: true,
    location: '',
    seatingCapacity: 2,
    owner: ownerData[0],
    Status: 'Active',
    brand: '',
    model: '',
    fuelType: 'Petrol',
    year: new Date().getFullYear(),
    registrationNumber: '',
    depositAmount: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // Combine upcoming and past bookings
  const allBookings = [...upcomingBookings.vehicleBookings, ...pastBookings.vehicleBookings];

  // Load initial data
  useEffect(() => {
    setVehicles(vehicleData);
    setBookings(allBookings);
  }, []);

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
    const averageRating = vehicles.reduce((sum, vehicle) => sum + vehicle.averageRating, 0) / totalVehicles;

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
    setFormData(prev => ({
      ...prev,
      images: files
    }));

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
  const handleSubmit = (e) => {
    e.preventDefault();

    const newVehicle = {
      _id: editingId || `vehicle_${Date.now()}`,
      vehicleName: formData.vehicleName,
      owner: formData.owner,
      vehicle_type: formData.vehicleType,
      rental_price_per_day: Number(formData.rentalPricePerDay),
      deposit_amount: Number(formData.depositAmount),
      features: formData.features,
      images: imagePreviews.length > 0 ? imagePreviews : [assets.defaultVehicle],
      isAvailable: formData.isAvailable,
      location: formData.location,
      seating_capacity: formData.seatingCapacity,
      description: formData.description,
      brand: formData.brand,
      model: formData.model,
      fuel_type: formData.fuelType,
      year: formData.year,
      registration_number: formData.registrationNumber,
      totalReviews: 0,
      averageRating: 0,
      ratingCount: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      creatDate: new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      // Update existing vehicle
      setVehicles(prev => prev.map(vehicle => vehicle.vehicle_id === editingId ? newVehicle : vehicle));
    } else {
      // Add new vehicle
      setVehicles(prev => [...prev, newVehicle]);
    }

    // Reset form
    resetForm();
  };

  // Toggle vehicle status between Active and Blocked
  const toggleVehicleStatus = (id) => {
    setVehicles(prev => prev.map(vehicle =>
      vehicle.vehicle_id === id ? {
        ...vehicle,
        Status: vehicle.Status === 'Active' ? 'Blocked' : 'Active'
      } : vehicle
    ));
  };

  // Edit vehicle
  const handleEdit = (vehicle) => {
    setFormData({
      _id: vehicle.vehicle_id,
      vehicleName: vehicle.vehicleName || `${vehicle.brand} ${vehicle.model}`,
      owner: vehicle.owner,
      vehicleType: vehicle.vehicle_type,
      rentalPricePerDay: vehicle.rental_price_per_day,
      depositAmount: vehicle.deposit_amount,
      features: vehicle.features || [],
      isAvailable: vehicle.isAvailable,
      location: vehicle.location,
      seatingCapacity: vehicle.seating_capacity,
      description: vehicle.description || '',
      customFeature: '',
      brand: vehicle.brand,
      model: vehicle.model,
      fuelType: vehicle.fuel_type,
      year: vehicle.year,
      registrationNumber: vehicle.registration_number
    });
    setImagePreviews(vehicle.vehicle_images || []);
    setEditingId(vehicle.vehicle_id);
    setActiveTab('add');
  };

  // Delete vehicle
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(vehicle => vehicle.vehicle_id !== id));
    }
  };

  // Toggle vehicle availability
  const toggleAvailability = (id) => {
    setVehicles(prev => prev.map(vehicle =>
      vehicle.vehicle_id === id ? { ...vehicle, isAvailable: !vehicle.isAvailable } : vehicle
    ));
  };

  // Update booking status
  const updateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(booking =>
      booking._id === id ? { ...booking, booking_status: newStatus } : booking
    ));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      _id: '',
      vehicleName: '',
      vehicleType: '',
      rentalPricePerDay: '',
      description: '',
      features: [],
      customFeature: '',
      images: [],
      isAvailable: true,
      location: '',
      seatingCapacity: 2,
      owner: ownerData[0],
      brand: '',
      model: '',
      fuelType: 'Petrol',
      year: new Date().getFullYear(),
      registrationNumber: '',
      depositAmount: ''
    });
    setImagePreviews([]);
    setEditingId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Owner</label>
                <select
                  name="owner"
                  value={formData.owner?.id || ''}
                  onChange={(e) => {
                    const selectedOwner = ownerData.find(owner => owner.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      owner: selectedOwner || ownerData[0]
                    }));
                  }}
                  required
                >
                  {ownerData.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.FullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Motorbike">Motorbike</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Bicycle">Bicycle</option>
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
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
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
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price Per Day (Rs)</label>
                <input
                  type="number"
                  name="rentalPricePerDay"
                  value={formData.rentalPricePerDay}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deposit Amount (Rs)</label>
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
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
                <label>Location</label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter vehicle location..."
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
            <button type="submit" className="submit-button">
              {editingId ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="submit-button"
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

          {/* Vehicles Table */}
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
                <tr key={vehicle.vehicle_id} className={`table-row ${vehicle.Status}`}>
                  <td>
                    <img
                      src={vehicle.vehicle_images?.[0] || assets.defaultVehicle}
                      alt={vehicle.vehicle_type}
                      className="vehicle-thumbnail"
                    />
                  </td>
                  <td>{vehicle.vehicle_id}</td>
                  <td>{vehicle.vehicleName || `${vehicle.brand} ${vehicle.model}`}</td>
                  <td>{vehicle.vehicle_type}</td>
                  <td>Rs {vehicle.rental_price_per_day}</td>
                  <td>{vehicle.owner?.FullName || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => toggleAvailability(vehicle.vehicle_id)}
                      className={`status-badge ${vehicle.isAvailable ? 'available' : 'occupied'}`}
                    >
                      {vehicle.isAvailable ? 'Available' : 'Occupied'}
                    </button>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${vehicle.Status === 'Blocked' ? 'blocked' : 'active'}`}
                      onClick={() => toggleVehicleStatus(vehicle.vehicle_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {vehicle.Status || 'Active'}
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
                      onClick={() => handleDelete(vehicle.vehicle_id)}
                      className="action-button delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                    <div className='primary-text'>{booking.vehicle?.vehicleName || `${booking.vehicle?.brand} ${booking.vehicle?.model}`}</div>
                    <div className="secondary-text">{booking.vehicle?.vehicle_type || ''}</div>
                  </td>
                  <td>
                    <div className='primary-text'>{booking.renter?.fullName || 'N/A'}</div>
                    <div className="secondary-text">{booking.renter?.email || ''}</div>
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
                      strokeDashoffset: 314 - (314 * (vehicleStats.occupiedVehicles / vehicleStats.totalVehicles))
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {Math.round((vehicleStats.occupiedVehicles / vehicleStats.totalVehicles) * 100)}%
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
              {['Motorbike', 'Car', 'Van', 'Scooter', 'Bicycle'].map(type => {
                const count = vehicles.filter(v => v.vehicle_type === type).length;
                const percentage = (count / vehicleStats.totalVehicles) * 100;
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