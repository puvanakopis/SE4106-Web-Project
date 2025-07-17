import React, { useState, useEffect } from 'react';
import { assets } from '../Assets/assets';
import { vehicleData, vehicleBookingsData } from '../Assets/assets';
import './Transport.css';

const Transport = () => {
  // ----------------------- State Management -----------------------
  const [formData, setFormData] = useState({
    vehicle_id: '',
    vehicle_type: '',
    brand: '',
    model: '',
    fuel_type: 'Diesel',
    seating_capacity: '',
    year: '',
    registration_number: '',
    rental_price_per_day: '',
    deposit_amount: '',
    address: '',
    availability_status: true,
    vehicle_images: [],
    average_rating: 4.4,
    owner: null,
    is_blocked: false
  });

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');

  // ----------------------- Constants -----------------------
  const vehicleTypes = ["Bus", "Car", "Van", "SUV", "Truck", "Motorcycle"];
  const fuelTypes = ["Diesel", "Petrol", "Electric", "Hybrid", "CNG"];

  // ----------------------- Effects -----------------------
  useEffect(() => {
    setVehicles(vehicleData);
    setBookings(vehicleBookingsData);
    const uniqueOwners = [...new Set(vehicleData.map(v => v.owner))];
    setOwners(uniqueOwners);
  }, []);

  // ----------------------- Data Processing -----------------------
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = vehicleTypeFilter === 'all' || vehicle.vehicle_type === vehicleTypeFilter;

    return matchesSearch && matchesType;
  });

  const calculateVehicleStats = () => {
    const totalVehicles = vehicles.length;
    const rentedVehicles = vehicles.filter(v => !v.availability_status).length;
    const availableVehicles = totalVehicles - rentedVehicles;
    const averageRating = vehicles.reduce((sum, vehicle) => sum + vehicle.average_rating, 0) / totalVehicles;
    const averagePrice = vehicles.reduce((sum, vehicle) => sum + vehicle.rental_price_per_day, 0) / totalVehicles;

    return {
      totalVehicles,
      rentedVehicles,
      availableVehicles,
      averageRating,
      averagePrice: Math.round(averagePrice)
    };
  };

  const calculateBookingStats = () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.booking_status === 'Confirmed').length;
    const pendingBookings = bookings.filter(b => b.booking_status === 'Pending').length;
    const cancelledBookings = bookings.filter(b => b.booking_status === 'Cancelled').length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.isPaid ? booking.totalPrice : 0), 0);

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue
    };
  };

  const vehicleStats = calculateVehicleStats();
  const bookingStats = calculateBookingStats();
  const filteredBookings = bookingStatusFilter === 'all'
    ? bookings
    : bookings.filter(booking => booking.booking_status === bookingStatusFilter);

  // ----------------------- Event Handlers -----------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      vehicle_images: files
    }));

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedOwner = owners.find(owner => owner._id === formData.owner);

    const newVehicle = {
      vehicle_id: editingId || `vehicle_${Date.now()}`,
      ...formData,
      vehicle_images: imagePreviews.length > 0 ? imagePreviews : [assets.defaultVehicle],
      rental_price_per_day: Number(formData.rental_price_per_day),
      deposit_amount: Number(formData.deposit_amount),
      seating_capacity: Number(formData.seating_capacity),
      year: Number(formData.year),
      average_rating: Number(formData.average_rating),
      owner: selectedOwner
    };

    if (editingId) {
      setVehicles(prev => prev.map(v => v.vehicle_id === editingId ? newVehicle : v));
    } else {
      setVehicles(prev => [...prev, newVehicle]);
    }

    resetForm();
  };

  const handleEdit = (vehicle) => {
    setFormData({
      vehicle_id: vehicle.vehicle_id,
      vehicle_type: vehicle.vehicle_type,
      brand: vehicle.brand,
      model: vehicle.model,
      fuel_type: vehicle.fuel_type,
      seating_capacity: vehicle.seating_capacity,
      year: vehicle.year,
      registration_number: vehicle.registration_number,
      rental_price_per_day: vehicle.rental_price_per_day,
      deposit_amount: vehicle.deposit_amount,
      address: vehicle.address,
      availability_status: vehicle.availability_status,
      vehicle_images: [],
      average_rating: vehicle.average_rating,
      owner: vehicle.owner._id,
      is_blocked: vehicle.is_blocked || false
    });
    setImagePreviews(vehicle.vehicle_images || []);
    setEditingId(vehicle.vehicle_id);
    setActiveTab('add');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(vehicle => vehicle.vehicle_id !== id));
    }
  };


  const toggleAvailability = (id) => {
    setVehicles(prev => prev.map(vehicle =>
      vehicle.vehicle_id === id ? { ...vehicle, availability_status: !vehicle.availability_status } : vehicle
    ));
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(booking =>
      booking.booking_id === id ? { ...booking, booking_status: newStatus } : booking
    ));
  };

  const resetForm = () => {
    setFormData({
      vehicle_id: '',
      vehicle_type: '',
      brand: '',
      model: '',
      fuel_type: 'Diesel',
      seating_capacity: '',
      year: '',
      registration_number: '',
      rental_price_per_day: '',
      deposit_amount: '',
      address: '',
      availability_status: true,
      vehicle_images: [],
      average_rating: 4.4,
      owner: null,
      is_blocked: false
    });
    setImagePreviews([]);
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ----------------------- Render Method -----------------------
  return (
    <div className="transport-container">
      {/* ----------------------- Header Section ----------------------- */}
      <h1 className="title">Transport Management</h1>

      {/* ----------------------- Navigation Tabs ----------------------- */}
      <nav className="tabs">
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
      </nav>

      {/* ----------------------- Add/Edit Vehicle Form  ----------------------- */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="vehicle-form">
          <section className="stats-summary">
            <div className="stat-card">
              <div>
                <h3>Total Vehicles</h3>
                <p>{vehicleStats.totalVehicles}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Rented</h3>
                <p>{vehicleStats.rentedVehicles}</p>
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
                <h3>Avg. Daily Price</h3>
                <p>Rs {vehicleStats.averagePrice}</p>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
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
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Seating Capacity</label>
                <input
                  type="number"
                  name="seating_capacity"
                  min="1"
                  value={formData.seating_capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Daily Rental Price (Rs)</label>
                <input
                  type="number"
                  name="rental_price_per_day"
                  min="0"
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
                  min="0"
                  value={formData.deposit_amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Owner</label>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map(owner => (
                    <option key={owner._id} value={owner._id}>
                      {owner.fullName} ({owner.contact})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={(e) => setFormData({ ...formData, availability_status: e.target.value === 'true' })}
                  required
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>

              <div className="form-group">
                <label>Average Rating</label>
                <input
                  type="number"
                  name="average_rating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.average_rating}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {editingId && (
                <div className="form-group">
                  <label>Block Status</label>
                  <select
                    name="is_blocked"
                    value={formData.is_blocked}
                    onChange={(e) => setFormData({ ...formData, is_blocked: e.target.value === 'true' })}
                  >
                    <option value="false">Active</option>
                    <option value="true">Blocked</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Vehicle Images</h2>
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
          </section>

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

      {/* View All Vehicles */}
      {activeTab === 'view' && (
        <div className="vehicles-list">
          <div className="list-header">
            <h2 className="section-title">All Vehicles ({filteredVehicles.length})</h2>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={vehicleTypeFilter}
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>ID</th>
                <th>Brand & Model</th>
                <th>Type</th>
                <th>Daily Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.vehicle_id}>
                  <td>
                    <img
                      src={vehicle.vehicle_images?.[0] || assets.defaultVehicle}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="vehicle-thumbnail"
                    />
                  </td>
                  <td className="vehicle-id">
                    {vehicle.vehicle_id}
                  </td>
                  <td>
                    <div className="vehicle-name">{vehicle.brand} {vehicle.model}</div>
                    <div className="vehicle-details secondary-text">{vehicle.year} • {vehicle.registration_number}</div>
                  </td>
                  <td>{vehicle.vehicle_type}</td>
                  <td>Rs {vehicle.rental_price_per_day}</td>
                  <td>
                    <button
                      onClick={() => toggleAvailability(vehicle.vehicle_id)}
                      className={`status-badge ${vehicle.availability_status ? 'available' : 'unavailable'}`}
                    >
                      {vehicle.availability_status ? 'Available' : 'Rented'}
                    </button>
                    {vehicle.is_blocked && (
                      <span className="status-badge blocked">Blocked</span>
                    )}
                  </td>
                  <td>

                    <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="bookings-list">
          <div className="list-header">
            <h2 className="section-title">All Bookings ({filteredBookings.length})</h2>
            <div className="search-filter">
              <input type="text" placeholder="Search bookings..." />
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle ID</th>
                <th>Vehicle</th>
                <th>Renter</th>
                <th>Dates</th>
                <th>Total Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className="small-text ">{booking.booking_id}</td>
                  <td className="secondary-text">{booking.vehicle.vehicle_id}</td>
                  <td>
                    <div>{booking.vehicle.brand} {booking.vehicle.model}</div>
                    <div className="secondary-text"> {booking.vehicle.vehicle_type}</div>
                  </td>
                  <td>
                    <div className='primary-text'>{booking.renter.fullName}</div>
                    <div className="secondary-text">{booking.renter.contact}</div>
                  </td>
                  <td>
                    <div className='primary-text'>{formatDate(booking.booking_start)}</div>
                    <div className="secondary-text">for {booking.booking_days} days</div>
                  </td>
                  <td>Rs {booking.totalPrice}</td>
                  <td>
                    <span className={`payment-status ${booking.isPaid ? 'paid' : 'unpaid'}`}>
                      {booking.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${booking.booking_status.toLowerCase()}`}>
                      {booking.booking_status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={booking.booking_status}
                      onChange={(e) => updateBookingStatus(booking.booking_id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirm</option>
                      <option value="Cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistics View */}
      {activeTab === 'stats' && (
        <div className="stats-view">
          <h2 className="section-title">Transport Statistics</h2>

          <div className="stats-cards">
            <div className="stat-card large">
              <h3>Utilization Rate</h3>
              <div className="progress-circle">
                <svg>
                  <circle className="bg" cx="60" cy="60" r="50"></circle>
                  <circle
                    className="progress"
                    cx="60"
                    cy="60"
                    r="50"
                    style={{
                      strokeDashoffset: 314 - (314 * (vehicleStats.rentedVehicles / vehicleStats.totalVehicles))
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {Math.round((vehicleStats.rentedVehicles / vehicleStats.totalVehicles) * 100)}%
                </div>
              </div>
              <p>{vehicleStats.rentedVehicles} of {vehicleStats.totalVehicles} vehicles rented</p>
            </div>

            <div className="stat-card">
              <h3>Total Bookings</h3>
              <div className="big-number">{bookingStats.totalBookings}</div>
              <div className="booking-stats">
                <div>Confirmed: {bookingStats.confirmedBookings}</div>
                <div>Pending: {bookingStats.pendingBookings}</div>
                <div>Cancelled: {bookingStats.cancelledBookings}</div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Revenue</h3>
              <div className="big-number">Rs {bookingStats.totalRevenue}</div>
              <p>From all bookings</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Vehicle Type Distribution</h3>
            <div className="bar-chart">
              {vehicleTypes.map(type => {
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

export default Transport;