import { useState, useEffect } from 'react';
import { assets } from '../../Assets/assets';
import './AdminTransport.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000/api';

const AdminTransport = () => {
  const [formData, setFormData] = useState({
    vehicle_name: '',
    vehicle_type: '',
    brand: '',
    model: '',
    fuel_type: 'Petrol',
    year: new Date().getFullYear(),
    registration_number: '',
    rental_price_per_day: '',
    deposit_amount: '',
    seating_capacity: 2,
    description: '',
    features: [],
    customFeature: '',
    address: '',
    location: {
      type: 'Point',
      coordinates: ['', ''],
      mapSrc: '',
      title: ''
    },
    isAvailable: true,
    status: 'Active',
    owner_id: ''
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
    "Hybrid Engine",
    "GPS Tracking",
    "Child Seat",
    "Roof Rack",
    "Towing Package",
    "Keyless Entry"
  ];

  // Vehicle types
  const vehicleTypes = ["Motorbike", "Car", "Scooter", "Bicycle", "Van", "Truck", "Other"];

  // Fuel types
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "Other"];

  // Status types
  const statusTypes = ["Active", "Blocked"];

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
    fetchOwners();
  }, []);

  // Get all transport
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/transports?limit=100`);
      const data = await response.json();

      if (data.success) {
        setVehicles(data.transports);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error loading vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Get all booking
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/transport-bookings`);
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

  // Create Vehicle 
  const createVehicle = async (vehicleData) => {
    try {
      const formData = new FormData();
      Object.keys(vehicleData).forEach(key => {
        if (key === 'features') {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else if (key !== 'vehicle_images' && key !== 'customFeature') {
          formData.append(key, vehicleData[key]);
        }
      });

      imageFiles.forEach(file => {
        formData.append('vehicle_images', file);
      });

      const response = await fetch(`${API_BASE}/transports`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await fetchVehicles();
        return { success: true, data: data.transport };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error creating vehicle:', error);
      return { success: false, message: 'Failed to create vehicle' };
    }
  };

  // Update Vehicle
  const updateVehicle = async (id, updateData) => {
    try {
      const formData = new FormData();

      Object.keys(updateData).forEach(key => {
        if (key === 'features') {
          formData.append(key, JSON.stringify(updateData[key]));
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(updateData[key]));
        } else if (key !== 'vehicle_images' && key !== 'customFeature') {
          formData.append(key, updateData[key]);
        }
      });

      imageFiles.forEach(file => {
        formData.append('vehicle_images', file);
      });

      const response = await fetch(`${API_BASE}/transports/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await fetchVehicles();
        return { success: true, data: data.transport };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return { success: false, message: 'Failed to update vehicle' };
    }
  };

  // Delete Vehicle
  const deleteVehicle = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/transports/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchVehicles();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return { success: false, message: 'Failed to delete vehicle' };
    }
  };

  // update Vehicle Status 
  const updateVehicleStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/transports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchVehicles();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, message: 'Failed to update status' };
    }
  };

  // Vehicle statistics
  const calculateVehicleStats = () => {
    const totalVehicles = vehicles.length;
    const occupiedVehicles = vehicles.filter(vehicle => !vehicle.isAvailable).length;
    const availableVehicles = totalVehicles - occupiedVehicles;
    const averageRating = vehicles.length > 0
      ? vehicles.reduce((sum, vehicle) => sum + (vehicle.averageRating || 0), 0) / totalVehicles
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
      const vehicleData = {
        ...formData,
        rental_price_per_day: parseFloat(formData.rental_price_per_day),
        deposit_amount: parseFloat(formData.deposit_amount),
        seating_capacity: parseInt(formData.seating_capacity),
        year: parseInt(formData.year),
        isAvailable: formData.isAvailable === 'true' || formData.isAvailable === true,
        location: {
          ...formData.location,
          coordinates: formData.location.coordinates.map(coord => parseFloat(coord) || 0)
        }
      };

      let result;
      if (editingId) {
        result = await updateVehicle(editingId, vehicleData);
      } else {
        result = await createVehicle(vehicleData);
      }

      if (result.success) {
        toast.success(editingId ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
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

  // Edit vehicle
  const handleEdit = (vehicle) => {
    setFormData({
      vehicle_name: vehicle.vehicle_name,
      vehicle_type: vehicle.vehicle_type,
      brand: vehicle.brand,
      model: vehicle.model,
      fuel_type: vehicle.fuel_type,
      year: vehicle.year,
      registration_number: vehicle.registration_number,
      rental_price_per_day: vehicle.rental_price_per_day,
      deposit_amount: vehicle.deposit_amount,
      seating_capacity: vehicle.seating_capacity,
      description: vehicle.description || '',
      features: vehicle.features || [],
      address: vehicle.address || '',
      location: {
        type: vehicle.location?.type || 'Point',
        coordinates: vehicle.location?.coordinates || ['', ''],
        mapSrc: vehicle.location?.mapSrc || '',
        title: vehicle.location?.title || ''
      },
      isAvailable: vehicle.isAvailable,
      status: vehicle.status,
      owner_id: vehicle.owner_id?._id || vehicle.owner_id,
      customFeature: '',
    });

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
    toast.info('Editing vehicle: ' + (vehicle.vehicle_name || `${vehicle.brand} ${vehicle.model}`));
  };

  // Delete vehicle
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setLoading(true);
      const result = await deleteVehicle(id);
      if (!result.success) {
        toast.error(result.message || 'Failed to delete vehicle');
      } else {
        toast.success('Vehicle deleted successfully!');
      }
      setLoading(false);
    }
  };

  // Toggle vehicle status
  const toggleVehicleStatus = async (id, currentStatus) => {
    setLoading(true);
    let newStatus;

    // Cycle through statuses
    if (currentStatus === 'Active') {
      newStatus = 'Blocked';
    } else {
      newStatus = 'Active';
    }

    const result = await updateVehicleStatus(id, newStatus);
    if (!result.success) {
      toast.error(result.message || 'Failed to update vehicle status');
    } else {
      toast.success(`Vehicle status updated to ${newStatus}`);
    }
    setLoading(false);
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
      vehicle_name: '',
      vehicle_type: '',
      brand: '',
      model: '',
      fuel_type: 'Petrol',
      year: new Date().getFullYear(),
      registration_number: '',
      rental_price_per_day: '',
      deposit_amount: '',
      seating_capacity: 2,
      description: '',
      features: [],
      customFeature: '',
      address: '',
      location: {
        type: 'Point',
        coordinates: ['', ''],
        mapSrc: '',
        title: ''
      },
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
    <div className="transport-container">
      {/* Page Title */}
      <h1 className="title">Transport & Bookings Management</h1>

      {/* ----------------- Navigation Tabs ----------------- */}
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

      {/* ----------------- Add/Edit Vehicle Form ----------------- */}
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
            <h2 className='section-title'>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Vehicle Name</label>
                <input
                  name="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={handleInputChange}
                  placeholder="e.g., City Commuter, Family Van"
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
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Brand</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Toyota, Honda, Yamaha"
                  required
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Corolla, Civic, MT-15"
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
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div className="form-group">
                <label>Registration Number</label>
                <input
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  placeholder="e.g., BA 1 PA 1234"
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
                <label>Seating Capacity</label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
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
                  placeholder="Enter vehicle location address..."
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
                  placeholder="Enter detailed description of the vehicle..."
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
                  placeholder="e.g., City Center, Near Airport"
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

          {/* Features */}
          <div className="form-section">
            <h2 className='section-title'>Features</h2>
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
            <h2 className='section-title'>Vehicle Images</h2>
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
              {loading ? 'Saving...' : (editingId ? 'Update Vehicle' : 'Add Vehicle')}
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

      {/* ----------------- View All Vehicles ----------------- */}
      {activeTab === 'view' && (
        <div className="vehicles-list">
          {/* Vehicles List Header */}
          <div className="list-header">
            <h2 className='section-title'>All Vehicles ({vehicles.length})</h2>
            <div className="search-filter">
              <input className='search-input' type="text" placeholder="Search vehicles..." />
              <select>
                <option>Filter by Type</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading vehicles...</div>
          ) : (
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Vehicle Name</th>
                  <th>Type</th>
                  <th>Brand/Model</th>
                  <th>Price/Day</th>
                  <th>Owner</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

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
                        alt={getVehicleDisplayName(vehicle)}
                        className="vehicle-thumbnail"
                      />
                    </td>
                    <td>{vehicle._id}</td>
                    <td>{getVehicleDisplayName(vehicle)}</td>
                    <td>{vehicle.vehicle_type}</td>
                    <td>{vehicle.brand} {vehicle.model}</td>
                    <td>Rs {vehicle.rental_price_per_day}</td>
                    <td>{getOwnerDisplayName(vehicle.owner_id)}</td>
                    <td>
                      <button
                        className={`status-badge ${vehicle.available === "Available" ? 'available' : 'occupied'}`}
                      >
                        {vehicle.available}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${vehicle.status === 'Active' ? 'active' : 'blocked'}`}
                        onClick={() => toggleVehicleStatus(vehicle._id, vehicle.status)}
                        style={{ cursor: 'pointer' }}
                      >
                        {vehicle.status}
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

          {vehicles.length === 0 && !loading && (
            <div className="no-data">
              No vehicles found
            </div>
          )}
        </div>
      )}

      {/* ----------------- Bookings Management ----------------- */}
      {activeTab === 'bookings' && (
        <div className="vehicles-list">
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
          <table className="vehicles-table">
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
              {vehicleTypes.map(type => {
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

          {/* Fuel Type Distribution */}
          <div className="chart-container">
            <h3>Fuel Type Distribution</h3>
            <div className="bar-chart">
              {fuelTypes.map(type => {
                const count = vehicles.filter(v => v.fuel_type === type).length;
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