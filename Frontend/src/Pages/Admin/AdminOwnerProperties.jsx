import React, { useState, useEffect } from 'react';
import './AdminOwnerProperties.css';
import Loading from '../Loading';

const API_BASE = 'http://localhost:5000/api';

const AdminOwnerProperties = ({ owner, onClose, onEdit, onDelete, onBlockToggle }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accommodationStats, setAccommodationStats] = useState(null);
  const [transportStats, setTransportStats] = useState(null);

  useEffect(() => {
    fetchOwnerProperties();
  }, [owner]);

  const fetchOwnerProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch accommodations
      const accommodationsResponse = await fetch(`http://localhost:5000/api/accommodations/owner/${owner._id}`);
      const accommodationsData = await accommodationsResponse.json();

      if (accommodationsData.success) {
        setAccommodations(accommodationsData.accommodations);
        setAccommodationStats(accommodationsData.statistics);
      } else {
        throw new Error(accommodationsData.message);
      }

      // Fetch transports
      const transportsResponse = await fetch(`http://localhost:5000/api/transports/owner/${owner._id}`);
      const transportsData = await transportsResponse.json();

      if (transportsData.success) {
        setTransports(transportsData.transports);
        setTransportStats(transportsData.statistics);
      } else {
        throw new Error(transportsData.message);
      }

    } catch (err) {
      console.error('Error fetching owner properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, type, currentStatus) => {
    try {
      const endpoint = type === 'accommodation'
        ? `http://localhost:5000/api/accommodations/${id}/status`
        : `http://localhost:5000/api/transports/${id}/status`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: currentStatus === 'Active' ? 'Blocked' : 'Active'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data
        fetchOwnerProperties();
        // Call the parent callback if provided
        if (onBlockToggle) {
          onBlockToggle(id, type, !currentStatus);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      const endpoint = type === 'accommodation'
        ? `http://localhost:5000/api/accommodations/${id}`
        : `http://localhost:5000/api/transports/${id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data
        fetchOwnerProperties();
        // Call the parent callback if provided
        if (onDelete) {
          onDelete(id, type);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(err.message);
    }
  };

  // Helper function to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-property.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return <Loading text='Loading admin properties...'/>
  }

  return (
    <div className="owner-properties">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{owner.fullName}'s Properties</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={fetchOwnerProperties} className="retry-button">Retry</button>
          </div>
        )}

        <div className="owner-info">
          <img
            src={owner.profile_pic
              ? `http://localhost:5000${owner.profile_pic}?t=${Date.now()}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName)}&background=random&color=fff`
            }
            alt={owner.fullName}
            className="owner-profile-pic"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div className="owner-details">
            <h3>{owner.fullName}</h3>
            <p>Email: {owner.email}</p>
            <p>Phone: {owner.phoneNumber}</p>
            <p>Status: <span className={`status-badge ${owner.status === "Active" ? 'active' : 'blocked'}`}>
              {owner.status}
            </span></p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Accommodations</h4>
              <div className="stat-value">{accommodationStats?.totalAccommodations || 0}</div>
              <div className="stat-details">
                <span className="available">{accommodationStats?.availableAccommodations || 0} Available</span>
                <span className="active">{accommodationStats?.activeAccommodations || 0} Active</span>
              </div>
            </div>
            <div className="stat-card">
              <h4>Vehicles</h4>
              <div className="stat-value">{transportStats?.totalVehicles || 0}</div>
              <div className="stat-details">
                <span className="available">{transportStats?.availableVehicles || 0} Available</span>
                <span className="active">{transportStats?.activeVehicles || 0} Active</span>
              </div>
            </div>
            <div className="stat-card">
              <h4>Average Rating</h4>
              <div className="stat-value">
                {((accommodationStats?.averageRating || 0) + (transportStats?.averageRating || 0)) / 2 || 0}/5
              </div>
              <div className="rating-stars">
                {'★'.repeat(Math.round(((accommodationStats?.averageRating || 0) + (transportStats?.averageRating || 0)) / 2))}
                {'☆'.repeat(5 - Math.round(((accommodationStats?.averageRating || 0) + (transportStats?.averageRating || 0)) / 2))}
              </div>
            </div>
          </div>
        </div>

        <div className="properties-section">
          <div className="section-header">
            <h3>Owned Accommodations ({accommodations.length})</h3>
          </div>
          {accommodations.length > 0 ? (
            <div className="table-container">
              <table className="properties-table">
                <thead>
                  <tr>
                    <th>Accommodation Name</th>
                    <th>Type</th>
                    <th>Price/Month</th>
                    <th>Bed/Bath</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accommodations.map(accommodation => (
                    <tr key={accommodation._id}>
                      <td>
                        <div className="property-info">
                          <img
                            src={getImageUrl(accommodation.images?.[0])}
                            alt={accommodation.accommodation_name}
                            className="property-thumbnail"
                            onError={(e) => {
                              e.target.src = '/default-property.png';
                            }}
                          />
                          <span>{accommodation.accommodation_name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="type-info">
                          <span className="property-type">{accommodation.property_type}</span>
                          <span className="accommodation-type">{accommodation.accommodation_type}</span>
                        </div>
                      </td>
                      <td>Rs. {accommodation.price_per_month?.toLocaleString()}</td>
                      <td>{accommodation.bedrooms} Bed, {accommodation.bathrooms} Bath</td>
                      <td>
                        <span className={`status-badge ${accommodation.available === "Available" ? 'available' : 'occupied'}`}>
                          {accommodation.available}
                        </span>
                        {accommodation.status === "Blocked" && <span className="blocked-badge">Blocked</span>}
                      </td>
                      <td className="actions-cell">
                        <button className="action-button edit" onClick={() => onEdit(accommodation, 'accommodation')}>
                          Edit
                        </button>
                        <button className="action-button delete" onClick={() => handleDelete(accommodation._id, 'accommodation')}>
                          Delete
                        </button>
                        <button
                          className={`action-button ${accommodation.status === "Active" ? 'block' : 'unblock'}`}
                          onClick={() => handleStatusToggle(accommodation._id, 'accommodation', accommodation.status)}
                        >
                          {accommodation.status === "Active" ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-properties">No accommodations owned by this user</p>
          )}
        </div>

        <div className="properties-section">
          <div className="section-header">
            <h3>Owned Vehicles ({transports.length})</h3>
          </div>
          {transports.length > 0 ? (
            <div className="table-container">
              <table className="properties-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Price/Day</th>
                    <th>Features</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transports.map(vehicle => (
                    <tr key={vehicle._id}>
                      <td>
                        <div className="property-info">
                          <img
                            src={getImageUrl(vehicle.vehicle_images?.[0])}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="property-thumbnail"
                            onError={(e) => {
                              e.target.src = '/default-vehicle.png';
                            }}
                          />
                          <span>{vehicle.brand} {vehicle.model}</span>
                        </div>
                      </td>
                      <td>{vehicle.vehicle_type}</td>
                      <td>Rs. {vehicle.rental_price_per_day?.toLocaleString()}</td>
                      <td className="features-cell">
                        {vehicle.features?.slice(0, 2).join(', ')}
                        {vehicle.features?.length > 2 && ` +${vehicle.features.length - 2}`}
                      </td>
                      <td>
                        <span className={`status-badge ${vehicle.isAvailable ? 'available' : 'occupied'}`}>
                          {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                        {vehicle.status === "Blocked" && <span className="blocked-badge">Blocked</span>}
                      </td>
                      <td className="actions-cell">
                        <button className="action-button edit" onClick={() => onEdit(vehicle, 'transport')}>
                          Edit
                        </button>
                        <button className="action-button delete" onClick={() => handleDelete(vehicle._id, 'transport')}>
                          Delete
                        </button>
                        <button
                          className={`action-button ${vehicle.status === "Active" ? 'block' : 'unblock'}`}
                          onClick={() => handleStatusToggle(vehicle._id, 'transport', vehicle.status)}
                        >
                          {vehicle.status === "Active" ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-properties">No vehicles owned by this user</p>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerProperties;