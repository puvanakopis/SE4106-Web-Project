import React, { useState, useEffect } from 'react';
import { accommodationsData, vehicleData, ownerData, upcomingBookings, pastBookings } from '../../Assets/assets';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // ----------------------- State Management -----------------------
  const [accommodations, setAccommodations] = useState([]);
  const [accommodationBookings, setAccommodationBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleBookings, setVehicleBookings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------- Data Loading -----------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Set data from imported assets
        setAccommodations(accommodationsData);
        setVehicles(vehicleData);
        setOwners(ownerData);

        // Combine upcoming and past bookings
        const allAccommodationBookings = [...upcomingBookings.accommodationBookings, ...pastBookings.accommodationBookings];
        const allVehicleBookings = [...upcomingBookings.vehicleBookings, ...pastBookings.vehicleBookings];

        setAccommodationBookings(allAccommodationBookings);
        setVehicleBookings(allVehicleBookings);

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ----------------------- Data Processing -----------------------
  const calculateAccommodationStats = () => {
    const totalAccommodations = accommodations.length;
    const occupiedAccommodations = accommodations.filter(accommodation => !accommodation.isAvailable).length;
    const availableAccommodations = totalAccommodations - occupiedAccommodations;
    const averageRating = accommodations.reduce((sum, accommodation) => sum + (accommodation.averageRating || 0), 0) / totalAccommodations;
    const averagePrice = accommodations.reduce((sum, accommodation) => sum + accommodation.pricePerMonth, 0) / totalAccommodations;

    return {
      totalAccommodations,
      occupiedAccommodations,
      availableAccommodations,
      averageRating,
      averagePrice: Math.round(averagePrice)
    };
  };

  const calculateVehicleStats = () => {
    const totalVehicles = vehicles.length;
    const rentedVehicles = vehicles.filter(v => !v.isAvailable).length;
    const availableVehicles = totalVehicles - rentedVehicles;
    const averageRating = vehicles.reduce((sum, vehicle) => sum + vehicle.averageRating, 0) / totalVehicles;
    const averagePrice = vehicles.reduce((sum, vehicle) => sum + vehicle.rental_price_per_day, 0) / totalVehicles;

    return {
      totalVehicles,
      rentedVehicles,
      availableVehicles,
      averageRating,
      averagePrice: Math.round(averagePrice)
    };
  };

  const calculateOwnerStats = () => {
    const totalOwners = owners.length;
    const activeOwners = owners.filter(owner => owner.Status === 'Active').length;
    const blockedOwners = totalOwners - activeOwners;
    const ownersWithProperties = owners.filter(owner => owner.properties && owner.properties.length > 0).length;

    return {
      totalOwners,
      activeOwners,
      blockedOwners,
      ownersWithProperties
    };
  };

  const calculateBookingStats = () => {
    const totalAccommodationBookings = accommodationBookings.length;
    const confirmedAccommodationBookings = accommodationBookings.filter(b => b.booking_status === 'confirmed').length;
    const canceledAccommodationBookings = accommodationBookings.filter(b => b.booking_status === 'canceled').length;
    const completedAccommodationBookings = accommodationBookings.filter(b => b.booking_status === 'completed').length;
    const accommodationRevenue = accommodationBookings.reduce((sum, booking) => sum + (booking.isPaid ? booking.totalPrice : 0), 0);

    const totalVehicleBookings = vehicleBookings.length;
    const confirmedVehicleBookings = vehicleBookings.filter(b => b.booking_status === 'confirmed').length;
    const canceledVehicleBookings = vehicleBookings.filter(b => b.booking_status === 'canceled').length;
    const completedVehicleBookings = vehicleBookings.filter(b => b.booking_status === 'completed').length;
    const vehicleRevenue = vehicleBookings.reduce((sum, booking) => sum + (booking.isPaid ? booking.totalPrice : 0), 0);

    return {
      totalBookings: totalAccommodationBookings + totalVehicleBookings,
      confirmedBookings: confirmedAccommodationBookings + confirmedVehicleBookings,
      pendingBookings: canceledAccommodationBookings + canceledVehicleBookings,
      completedBookings: completedAccommodationBookings + completedVehicleBookings,
      totalRevenue: accommodationRevenue + vehicleRevenue,
      accommodationStats: {
        total: totalAccommodationBookings,
        confirmed: confirmedAccommodationBookings,
        pending: canceledAccommodationBookings,
        completed: completedAccommodationBookings,
        revenue: accommodationRevenue
      },
      vehicleStats: {
        total: totalVehicleBookings,
        confirmed: confirmedVehicleBookings,
        pending: canceledVehicleBookings,
        completed: completedVehicleBookings,
        revenue: vehicleRevenue
      }
    };
  };

  const accommodationStats = calculateAccommodationStats();
  const vehicleStats = calculateVehicleStats();
  const ownerStats = calculateOwnerStats();
  const bookingStats = calculateBookingStats();

  // ----------------------- Formatting Helpers -----------------------
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0).replace('₹', 'Rs ');
  };

  // ----------------------- Normalized Bookings Data -----------------------
  const getNormalizedBookings = () => {
    return [
      ...accommodationBookings.map(booking => ({
        id: booking._id,
        type: 'accommodation',
        date: booking.booking_start,
        checkInDate: booking.booking_start,
        checkOutDate: booking.booking_end,
        details: `${booking.accommodation?.accommodationName || 'N/A'} (${booking.accommodation?.accommodationType || 'N/A'})`,
        customer: booking.renter?.displayNamename || 'N/A',
        days: booking.booking_start && booking.booking_end
          ? Math.ceil((new Date(booking.booking_end) - new Date(booking.booking_start)) / (1000 * 60 * 60 * 24))
          : 0,
        amount: booking.totalPrice || 0,
        status: booking.booking_status?.toLowerCase() || 'unknown',
        isPaid: booking.isPaid || false
      })),
      ...vehicleBookings.map(booking => ({
        id: booking._id,
        type: 'vehicle',
        date: booking.booking_start,
        details: `${booking.vehicle?.brand || 'N/A'} ${booking.vehicle?.model || 'N/A'} (${booking.vehicle?.vehicle_type || 'N/A'})`,
        customer: booking.renter?.displayNamename || 'N/A',
        days: booking.booking_start && booking.booking_end,
        amount: booking.totalPrice || 0,
        status: booking.booking_status?.toLowerCase() || 'unknown',
        isPaid: booking.isPaid || false
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const normalizedBookings = getNormalizedBookings();

  // ----------------------- Recent Activities -----------------------
  const getRecentActivities = () => {
    return [
      ...accommodationBookings.slice(0, 3).map(booking => ({
        id: booking._id,
        type: 'accommodation',
        title: `Accommodation Booking ${booking.booking_status}`,
        description: `Booking for ${booking.accommodation?.accommodationName || 'N/A'}`,
        date: booking.booking_start,
        status: booking.booking_status?.toLowerCase(),
        amount: booking.totalPrice
      })),
      ...vehicleBookings.slice(0, 3).map(booking => ({
        id: booking._id,
        type: 'vehicle',
        title: `Vehicle Booking ${booking.booking_status}`,
        description: `Booking for ${booking.vehicle?.brand || 'N/A'} ${booking.vehicle?.model || 'N/A'}`,
        date: booking.booking_start,
        status: booking.booking_status?.toLowerCase(),
        amount: booking.totalPrice
      })),
      ...owners.slice(0, 2).map(owner => ({
        id: owner.id || owner._id,
        type: 'owner',
        title: `${owner.isBlocked ? 'Blocked' : 'Registered'} Owner`,
        description: `${owner.FullName || owner.username || 'N/A'} - ${owner.email || 'N/A'}`,
        date: owner.accontCretDate || '2023-01-01',
        status: owner.isBlocked ? 'blocked' : 'active'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const recentActivities = getRecentActivities();

  // ----------------------- Render Method -----------------------
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* ----------------------- Header Section ----------------------- */}
      <div className="dashboard-header">
        <h1 className="title">Admin Dashboard</h1>
      </div>

      {/* ----------------------- Navigation Tabs ----------------------- */}
      <nav className="tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          disabled={isLoading}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'accommodations' ? 'active' : ''}`}
          onClick={() => setActiveTab('accommodations')}
          disabled={isLoading}
        >
          Accommodations
        </button>
        <button
          className={`tab-button ${activeTab === 'transport' ? 'active' : ''}`}
          onClick={() => setActiveTab('transport')}
          disabled={isLoading}
        >
          Transport
        </button>
        <button
          className={`tab-button ${activeTab === 'owners' ? 'active' : ''}`}
          onClick={() => setActiveTab('owners')}
          disabled={isLoading}
        >
          Owners
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
          disabled={isLoading}
        >
          Bookings
        </button>
      </nav>

      {/* ----------------------- Overview Tab ----------------------- */}
      {activeTab === 'overview' && (
        <div className="overview-tab">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card total-revenue">
              <div className="card-content">
                <h3>Total Revenue</h3>
                <p>{formatCurrency(bookingStats.totalRevenue)}</p>
                <span className="card-subtext">All bookings</span>
              </div>
            </div>

            <div className="summary-card total-bookings">
              <div className="card-content">
                <h3>Total Bookings</h3>
                <p>{bookingStats.totalBookings}</p>
                <span className="card-subtext">All services</span>
              </div>
            </div>

            <div className="summary-card total-accommodations">
              <div className="card-content">
                <h3>Total Accommodations</h3>
                <p>{accommodationStats.totalAccommodations}</p>
                <span className="card-subtext">{accommodationStats.availableAccommodations} available</span>
              </div>
            </div>

            <div className="summary-card total-vehicles">
              <div className="card-content">
                <h3>Total Vehicles</h3>
                <p>{vehicleStats.totalVehicles}</p>
                <span className="card-subtext">{vehicleStats.availableVehicles} available</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>Revenue Breakdown</h3>
              <div className="doughnut-chart">
                <div className="chart-visual">
                  <div
                    className="chart-segment accommodations"
                    style={{
                      '--percentage': `${Math.round((bookingStats.accommodationStats.revenue / bookingStats.totalRevenue) * 100)}%`,
                      '--color': '#3b82f6'
                    }}
                  > </div>
                  <div
                    className="chart-segment vehicles"
                    style={{
                      '--percentage': `${Math.round((bookingStats.vehicleStats.revenue / bookingStats.totalRevenue) * 100)}%`,
                      '--color': '#f59e0b'
                    }}
                  ></div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="color-dot accommodations"></span>
                    <span>Accommodations: {formatCurrency(bookingStats.accommodationStats.revenue)}</span>
                  </div>
                  <div className="legend-item">
                    <span className="color-dot vehicles"></span>
                    <span>Vehicles: {formatCurrency(bookingStats.vehicleStats.revenue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="recent-activities">
            <h2>Recent Activities</h2>
            {recentActivities.length === 0 ? (
              <div className="empty-state">No recent activities found</div>
            ) : (
              <div className="activities-list">
                {recentActivities.map((activity, index) => (
                  <div key={`${activity.id}-${index}`} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'accommodation' && '🛏️'}
                      {activity.type === 'vehicle' && '🚗'}
                      {activity.type === 'owner' && '👤'}
                    </div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <div className="activity-meta">
                        <span className="activity-date">{formatDate(activity.date)}</span>
                        {activity.amount > 0 && (
                          <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                        )}
                      </div>
                    </div>
                    <div className={`activity-status ${activity.status || 'unknown'}`}>
                      {activity.status || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------- Accommodations Tab ----------------------- */}
      {activeTab === 'accommodations' && (
        <div className="accommodations-tab">
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
                <h3>Avg. Price</h3>
                <p>{formatCurrency(accommodationStats.averagePrice)}</p>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>Accommodation Type Distribution</h3>
            <div className="bar-chart">
              {['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'].map(type => {
                const count = accommodations.filter(r => r.accommodationType === type).length;
                const percentage = (count / accommodationStats.totalAccommodations) * 100;
                return (
                  <div key={type} className="bar" style={{ height: `${percentage}%` }}>
                    <div className="bar-label">{type}</div>
                    <div className="bar-value">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="recent-accommodation-bookings">
            <h3>Recent Accommodation Bookings</h3>
            {accommodationBookings.length === 0 ? (
              <div className="empty-state">No accommodation bookings found</div>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Accommodation</th>
                    <th>Guest</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accommodationBookings.slice(0, 5).map(booking => (
                    <tr key={booking._id}>
                      <td className="booking-id">{booking._id}</td>
                      <td>
                        <div>{booking.accommodation?.accommodationName || 'N/A'}</div>
                        <div className="small-text">{booking.accommodation?.accommodationType || 'N/A'}</div>
                      </td>
                      <td>{booking.renter?.displayNamename || 'N/A'}</td>
                      <td>
                        <div>{formatDate(booking.booking_start)}</div>
                        <div className="small-text">to {formatDate(booking.booking_end)}</div>
                      </td>
                      <td>{formatCurrency(booking.totalPrice)}</td>
                      <td>
                        <span className={`status-badge ${booking.booking_status?.toLowerCase() || 'unknown'}`}>
                          {booking.booking_status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ----------------------- Transport Tab ----------------------- */}
      {activeTab === 'transport' && (
        <div className="transport-tab">
          <div className="stats-summary">
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
                <p>{formatCurrency(vehicleStats.averagePrice)}</p>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>Vehicle Type Distribution</h3>
            <div className="bar-chart">
              {['Motorbike', 'Car', 'Van', 'SUV', 'Truck', 'Bus'].map(type => {
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

          <div className="recent-vehicle-bookings">
            <h3>Recent Vehicle Bookings</h3>
            {vehicleBookings.length === 0 ? (
              <div className="empty-state">No vehicle bookings found</div>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Renter</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleBookings.slice(0, 5).map(booking => (
                    <tr key={booking._id}>
                      <td className="booking-id">{booking._id}</td>
                      <td>
                        <div>{booking.vehicle?.brand || 'N/A'} {booking.vehicle?.model || 'N/A'}</div>
                        <div className="small-text">{booking.vehicle?.vehicle_type || 'N/A'}</div>
                      </td>
                      <td>{booking.renter?.displayNamename || 'N/A'}</td>
                      <td>
                        <div>{formatDate(booking.booking_start)}</div>
                        <div className="small-text">to {formatDate(booking.booking_end)}</div>
                      </td>
                      <td>{formatCurrency(booking.totalPrice)}</td>
                      <td>
                        <span className={`status-badge ${booking.booking_status?.toLowerCase() || 'unknown'}`}>
                          {booking.booking_status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ----------------------- Owners Tab ----------------------- */}
      {activeTab === 'owners' && (
        <div className="owners-tab">
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

          <div className="chart-container">
            <h3>Owner Status Distribution</h3>
            <div className="doughnut-chart">
              <div className="chart-visual">
                <div
                  className="chart-segment active"
                  style={{
                    '--percentage': `${Math.round((ownerStats.activeOwners / ownerStats.totalOwners) * 100)}%`,
                    '--color': '#10b981'
                  }}
                ></div>
                <div
                  className="chart-segment blocked"
                  style={{
                    '--percentage': `${Math.round((ownerStats.blockedOwners / ownerStats.totalOwners) * 100)}%`,
                    '--color': '#ef4444'
                  }}
                ></div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="color-dot active"></span>
                  <span>Active: {ownerStats.activeOwners}</span>
                </div>
                <div className="legend-item">
                  <span className="color-dot blocked"></span>
                  <span>Blocked: {ownerStats.blockedOwners}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-owners">
            <h3>Recent Owner Activities</h3>
            {owners.length === 0 ? (
              <div className="empty-state">No owners found</div>
            ) : (
              <table className="owners-table">
                <thead>
                  <tr>
                    <th>Owner</th>
                    <th>Email</th>
                    <th>Properties</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.slice(0, 5).map(owner => (
                    <tr key={owner.id || owner._id}>
                      <td>
                        <div className="owner-info">
                          <img
                            src={owner.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.FullName || owner.username || 'Owner')}&background=random&color=fff`}
                            alt={owner.FullName || owner.username || 'Owner'}
                            className="owner-avatar"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.FullName || owner.username || 'Owner')}&background=random&color=fff`;
                            }}
                          />
                          <span>{owner.FullName || owner.username || 'N/A'}</span>
                        </div>
                      </td>
                      <td>{owner.email || 'N/A'}</td>
                      <td>{owner.properties?.length || 0}</td>
                      <td>
                        <span className={`status-badge ${owner.Status}`}>
                          {owner.Status}
                        </span>
                      </td>
                      <td>{formatDate(owner.accontCretDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ----------------------- Bookings Tab ----------------------- */}
      {activeTab === 'bookings' && (
        <div className="bookings-tab">
          <div className="stats-summary">
            <div className="stat-card">
              <div>
                <h3>Total Bookings</h3>
                <p>{bookingStats.totalBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Completed</h3>
                <p>{bookingStats.completedBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Confirmed</h3>
                <p>{bookingStats.confirmedBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Canceled</h3>
                <p>{bookingStats.pendingBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <h3>Revenue</h3>
                <p>{formatCurrency(bookingStats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bookings-breakdown">
            <div className="breakdown-card">
              <h3>Accommodation Bookings</h3>
              <div className="breakdown-stats">
                <div>
                  <span>Total:</span>
                  <span>{bookingStats.accommodationStats.total}</span>
                </div>
                <div>
                  <span>Completed:</span>
                  <span>{bookingStats.accommodationStats.completed}</span>
                </div>
                <div>
                  <span>Confirmed:</span>
                  <span>{bookingStats.accommodationStats.confirmed}</span>
                </div>
                <div>
                  <span>Canceled:</span>
                  <span>{bookingStats.accommodationStats.pending}</span>
                </div>
                <div>
                  <span>Revenue:</span>
                  <span>{formatCurrency(bookingStats.accommodationStats.revenue)}</span>
                </div>
              </div>
            </div>

            <div className="breakdown-card">
              <h3>Vehicle Bookings</h3>
              <div className="breakdown-stats">
                <div>
                  <span>Total:</span>
                  <span>{bookingStats.vehicleStats.total}</span>
                </div>
                <div>
                  <span>Completed:</span>
                  <span>{bookingStats.vehicleStats.completed}</span>
                </div>
                <div>
                  <span>Confirmed:</span>
                  <span>{bookingStats.vehicleStats.confirmed}</span>
                </div>
                <div>
                  <span>Canceled:</span>
                  <span>{bookingStats.vehicleStats.pending}</span>
                </div>
                <div>
                  <span>Revenue:</span>
                  <span>{formatCurrency(bookingStats.vehicleStats.revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="all-bookings">
            <h3>All Bookings</h3>
            {normalizedBookings.length === 0 ? (
              <div className="empty-state">No bookings found</div>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Booking ID</th>
                    <th>Details</th>
                    <th>Customer</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {normalizedBookings.slice(0, 10).map((booking, index) => (
                    <tr key={`${booking.id}-${index}`}>
                      <td>
                        {booking.type === 'accommodation' ? '🛏️ Accommodation' : '🚗 Vehicle'}
                      </td>
                      <td className="booking-id">
                        {booking.id}
                      </td>
                      <td>
                        {booking.details}
                      </td>
                      <td>
                        {booking.customer}
                      </td>
                      <td>
                        {formatDate(booking.date)}
                        {booking.days > 0 && (
                          <div className="small-text">{booking.days} days</div>
                        )}
                      </td>
                      <td>
                        {formatCurrency(booking.amount)}
                      </td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;