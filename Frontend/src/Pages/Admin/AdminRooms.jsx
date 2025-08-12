import { useState, useEffect } from 'react';
import { assets } from '../../Assets/assets';
import { roomsData, ownerData, upcomingBookings, pastBookings } from '../../Assets/assets';
import './AdminRooms.css';

const AdminRooms = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    _id: '',
    roomName: '',
    roomType: '',
    pricePerMonth: '',
    description: '',
    amenities: [],
    customAmenity: '',
    images: [],
    isAvailable: true,
    location: '',
    noOfBed: 1,
    owner: ownerData[0],
    Status: 'Active'
  });

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // Combine upcoming and past bookings
  const allBookings = [...upcomingBookings.roomBookings, ...pastBookings.roomBookings];

  // Load initial data
  useEffect(() => {
    setRooms(roomsData);
    setBookings(allBookings);
  }, []);

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

  // Room statistics
  const calculateRoomStats = () => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => !room.isAvailable).length;
    const availableRooms = totalRooms - occupiedRooms;
    const averageRating = rooms.reduce((sum, room) => sum + room.averageRating, 0) / totalRooms;

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      averageRating: averageRating.toFixed(1),
    };
  };

  const roomStats = calculateRoomStats();

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
  const handleSubmit = (e) => {
    e.preventDefault();

    const newRoom = {
      _id: editingId || `room_${Date.now()}`,
      roomName: formData.roomName,
      owner: formData.owner,
      roomType: formData.roomType,
      pricePerMonth: Number(formData.pricePerMonth),
      SecurityDeposit: formData.roomType === 'Single Bed' ? 10000 :
        formData.roomType === 'Double Bed' ? 15000 :
          formData.roomType === 'Triple Sharing' ? 20000 : 25000,
      amenities: formData.amenities,
      images: imagePreviews.length > 0 ? imagePreviews : [assets.defaultRoom],
      isAvailable: formData.isAvailable,
      location: formData.location,
      noOfBed: formData.noOfBed,
      description: formData.description,
      totalReviews: 0,
      averageRating: 0,
      ratingCount: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      creatDate: new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      // Update existing room
      setRooms(prev => prev.map(room => room._id === editingId ? newRoom : room));
    } else {
      // Add new room
      setRooms(prev => [...prev, newRoom]);
    }

    // Reset form
    resetForm();
  };

  // Toggle room status between Active and Blocked
  const toggleRoomStatus = (id) => {
    setRooms(prev => prev.map(room =>
      room._id === id ? {
        ...room,
        Status: room.Status === 'Active' ? 'Blocked' : 'Active'
      } : room
    ));
  };
  // Edit room
  const handleEdit = (room) => {
    setFormData({
      _id: room._id,
      roomName: room.roomName,
      owner: room.owner,
      roomType: room.roomType,
      pricePerMonth: room.pricePerMonth,
      amenities: room.amenities || [],
      isAvailable: room.isAvailable,
      location: room.location,
      noOfBed: room.noOfBed,
      description: room.description || '',
      customAmenity: '',
    });
    setImagePreviews(room.images || []);
    setEditingId(room._id);
    setActiveTab('add');
  };

  // Delete room
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(prev => prev.filter(room => room._id !== id));
    }
  };

  // Toggle room availability
  const toggleAvailability = (id) => {
    setRooms(prev => prev.map(room =>
      room._id === id ? { ...room, isAvailable: !room.isAvailable } : room
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
      roomName: '',
      roomType: '',
      pricePerMonth: '',
      description: '',
      amenities: [],
      customAmenity: '',
      images: [],
      isAvailable: true,
      location: '',
      noOfBed: 1,
      owner: ownerData[0]
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
    <div className="rooms-container">
      {/* --------------------------- Page Title --------------------------- */}
      <h1 className="title">Rooms & Bookings Management</h1>

      {/* ---------------------------  Navigation Tabs --------------------------- */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          {editingId ? 'Edit Room' : 'Add Room'}
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View All Rooms
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

      {/*  ----------------- Add/Edit Room Form --------------------------- */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="room-form">
          {/* Room Statistics Summary */}
          <div className="stats-summary">
            <div className="stat-card">
              <div>
                <h3>Total Rooms</h3>
                <p>{roomStats.totalRooms}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Occupied</h3>
                <p>{roomStats.occupiedRooms}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Available</h3>
                <p>{roomStats.availableRooms}</p>
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
                <label>Room Name</label>
                <input
                  name="roomName"
                  value={formData.roomName}
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
                <label>Room Type</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Room Type</option>
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
                  placeholder="Enter room location..."
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
                  placeholder="Enter detailed description of the room..."
                  rows="2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h2 className='section-title '>Amenities</h2>
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

          {/* Room Images */}
          <div className="form-section">
            <h2 className='section-title '>Room Images</h2>
            <div className="image-upload-container">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                id="room-images"
                style={{ display: 'none' }}
              />
              <label htmlFor="room-images" className="upload-button">
                Choose Images (4 recommended)
              </label>

              <div className="image-preview-grid">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Room preview ${index}`} />
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
              {editingId ? 'Update Room' : 'Add Room'}
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

      {/* ----------------------------------- View All Rooms -----------------------------------*/}
      {activeTab === 'view' && (
        <div className="rooms-list">
          {/* Rooms List Header */}
          <div className="list-header">
            <h2 className='section-title '>All Rooms ({rooms.length})</h2>
            <div className="search-filter">
              <input className='search-input' type="text" placeholder="Search rooms..." />
              <select>
                <option>Filter by Type</option>
                <option value='Single'>Single Bed</option>
                <option value='Double'>Double Bed</option>
                <option value='Triple'>Triple Sharing</option>
                <option value='Annexe'>Annexe</option>
              </select>
            </div>
          </div>

          {/* Rooms Table */}
          <table className="rooms-table">
            {/* Table Header */}
            <thead>
              <tr>
                <th>Image</th>
                <th>ID</th>
                <th>Room Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Owner</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            {/* Table Body */}
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className={`table-row ${room.Status}`}>
                  <td>
                    <img
                      src={room.images?.[0] || assets.defaultRoom}
                      alt={room.roomType}
                      className="room-thumbnail"
                    />
                  </td>
                  <td>{room._id}</td>
                  <td>{room.roomName}</td>
                  <td>{room.roomType}</td>
                  <td>Rs {room.pricePerMonth}</td>
                  <td>{room.owner?.FullName || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => toggleAvailability(room._id)}
                      className={`status-badge ${room.isAvailable ? 'available' : 'occupied'}`}
                    >
                      {room.isAvailable ? 'Available' : 'Occupied'}
                    </button>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${room.Status === 'Blocked' ? 'blocked' : 'active'}`}
                      onClick={() => toggleRoomStatus(room._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {room.Status || 'Active'}
                    </span>
                  </td>

                  <td className='flex'>
                    <button
                      onClick={() => handleEdit(room)}
                      className="action-button edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
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
        <div className="rooms-list">
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
          <table className="rooms-table">
            {/* Table Header */}
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Room</th>
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
                    <div className='primary-text'>{booking.room?.roomName || 'N/A'}</div>
                    <div className="secondary-text">{booking.room?.roomType || ''}</div>
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
                      strokeDashoffset: 314 - (314 * (roomStats.occupiedRooms / roomStats.totalRooms))
                    }}
                  ></circle>
                </svg>
                <div className="percentage">
                  {Math.round((roomStats.occupiedRooms / roomStats.totalRooms) * 100)}%
                </div>
              </div>
              <p>{roomStats.occupiedRooms} of {roomStats.totalRooms} rooms occupied</p>
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

          {/* Room Type Distribution */}
          <div className="chart-container">
            <h3>Room Type Distribution</h3>
            <div className="bar-chart">
              {['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'].map(type => {
                const count = rooms.filter(r => r.roomType === type).length;
                const percentage = (count / roomStats.totalRooms) * 100;
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

export default AdminRooms;