import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';
import Loading from '../Loading';

const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [accommodationBookings, setAccommodationBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleBookings, setVehicleBookings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const { getOwners } = useContext(AuthContext);

  // ----------------------- Data Loading -----------------------
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        await Promise.all([
          fetchAccommodations(),
          fetchAccommodationBookings(),
          fetchVehicles(),
          fetchVehicleBookings(),
          fetchOwnersData()
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
        toast.error('Failed to load dashboard data');
      }
    };

    fetchAllData();
  }, []);

  // Fetch accommodations
  const fetchAccommodations = async () => {
    try {
      const response = await fetch(`${API_BASE}/accommodations?limit=100`);
      const data = await response.json();
      if (data.success) {
        setAccommodations(data.accommodations || []);
      } else {
        throw new Error(data.message || 'Failed to fetch accommodations');
      }
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      throw new Error('Failed to load accommodations');
    }
  };

  // Fetch accommodation bookings
  const fetchAccommodationBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/accommodation-bookings`);
      const data = await response.json();
      if (data.success) {
        setAccommodationBookings(data.bookings || []);
      } else {
        throw new Error(data.message || 'Failed to fetch accommodation bookings');
      }
    } catch (error) {
      console.error('Error fetching accommodation bookings:', error);
      throw new Error('Failed to load accommodation bookings');
    }
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE}/transports?limit=100`);
      const data = await response.json();
      if (data.success) {
        setVehicles(data.transports || []);
      } else {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error('Failed to load vehicles');
    }
  };

  // Fetch vehicle bookings
  const fetchVehicleBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/transport-bookings`);
      const data = await response.json();
      if (data.success) {
        setVehicleBookings(data.bookings || []);
      } else {
        throw new Error(data.message || 'Failed to fetch vehicle bookings');
      }
    } catch (error) {
      console.error('Error fetching vehicle bookings:', error);
      throw new Error('Failed to load vehicle bookings');
    }
  };

  // Fetch owners
  const fetchOwnersData = async () => {
    try {
      const ownersData = await getOwners();
      setOwners(ownersData || []);
    } catch (error) {
      console.error('Error fetching owners:', error);
      throw new Error('Failed to load owners');
    }
  };

  // Refresh data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAccommodations(),
        fetchAccommodationBookings(),
        fetchVehicles(),
        fetchVehicleBookings(),
        fetchOwnersData()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- Data Processing -----------------------
  const calculateAccommodationStats = () => {
    const totalAccommodations = accommodations.length;
    const occupiedAccommodations = accommodations.filter(acc => !acc.isAvailable).length;
    const availableAccommodations = totalAccommodations - occupiedAccommodations;

    const averageRating = accommodations.length > 0
      ? accommodations.reduce((sum, acc) => sum + (acc.averageRating || 0), 0) / totalAccommodations
      : 0;

    const averagePrice = accommodations.length > 0
      ? accommodations.reduce((sum, acc) => sum + (acc.price_per_month || 0), 0) / totalAccommodations
      : 0;

    return {
      totalAccommodations,
      occupiedAccommodations,
      availableAccommodations,
      averageRating: averageRating.toFixed(1),
      averagePrice: Math.round(averagePrice)
    };
  };

  const calculateVehicleStats = () => {
    const totalVehicles = vehicles.length;
    const rentedVehicles = vehicles.filter(vehicle => !vehicle.isAvailable).length;
    const availableVehicles = totalVehicles - rentedVehicles;

    const averageRating = vehicles.length > 0
      ? vehicles.reduce((sum, vehicle) => sum + (vehicle.averageRating || 0), 0) / totalVehicles
      : 0;

    const averagePrice = vehicles.length > 0
      ? vehicles.reduce((sum, vehicle) => sum + (vehicle.rental_price_per_day || 0), 0) / totalVehicles
      : 0;

    return {
      totalVehicles,
      rentedVehicles,
      availableVehicles,
      averageRating: averageRating.toFixed(1),
      averagePrice: Math.round(averagePrice)
    };
  };

  const calculateOwnerStats = () => {
    const totalOwners = owners.length;
    const activeOwners = owners.filter(owner => owner.status === 'Active').length;
    const blockedOwners = totalOwners - activeOwners;

    // Count owners with properties (both accommodations and vehicles)
    const ownersWithProperties = owners.filter(owner => {
      const hasAccommodations = accommodations.some(acc =>
        acc.owner_id === owner._id || acc.owner_id?._id === owner._id
      );
      const hasVehicles = vehicles.some(vehicle =>
        vehicle.owner_id === owner._id || vehicle.owner_id?._id === owner._id
      );
      return hasAccommodations || hasVehicles;
    }).length;

    return {
      totalOwners,
      activeOwners,
      blockedOwners,
      ownersWithProperties
    };
  };

  const calculateBookingStats = () => {
    // Accommodation bookings stats
    const totalAccommodationBookings = accommodationBookings.length;
    const confirmedAccommodationBookings = accommodationBookings.filter(b => b.booking_status === 'confirmed').length;
    const cancelledAccommodationBookings = accommodationBookings.filter(b => b.booking_status === 'cancelled').length;
    const completedAccommodationBookings = accommodationBookings.filter(b => b.booking_status === 'completed').length;

    // Calculate accommodation revenue from completed payments
    const accommodationRevenue = accommodationBookings.reduce((sum, booking) => {
      if (booking.paymentDetails?.paymentStatus === "completed" || booking.isPaid) {
        return sum + (booking.totalPrice || 0);
      }
      return sum;
    }, 0);

    // Vehicle bookings stats
    const totalVehicleBookings = vehicleBookings.length;
    const confirmedVehicleBookings = vehicleBookings.filter(b => b.booking_status === 'confirmed').length;
    const cancelledVehicleBookings = vehicleBookings.filter(b => b.booking_status === 'cancelled').length;
    const completedVehicleBookings = vehicleBookings.filter(b => b.booking_status === 'completed').length;

    // Calculate vehicle revenue from completed payments
    const vehicleRevenue = vehicleBookings.reduce((sum, booking) => {
      if (booking.paymentDetails?.paymentStatus === "completed" || booking.isPaid) {
        return sum + (booking.totalPrice || 0);
      }
      return sum;
    }, 0);

    return {
      totalBookings: totalAccommodationBookings + totalVehicleBookings,
      confirmedBookings: confirmedAccommodationBookings + confirmedVehicleBookings,
      cancelledBookings: cancelledAccommodationBookings + cancelledVehicleBookings,
      completedBookings: completedAccommodationBookings + completedVehicleBookings,
      totalRevenue: accommodationRevenue + vehicleRevenue,
      accommodationStats: {
        total: totalAccommodationBookings,
        confirmed: confirmedAccommodationBookings,
        cancelled: cancelledAccommodationBookings,
        completed: completedAccommodationBookings,
        revenue: accommodationRevenue
      },
      vehicleStats: {
        total: totalVehicleBookings,
        confirmed: confirmedVehicleBookings,
        cancelled: cancelledVehicleBookings,
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
        date: booking.createdAt || booking.booking_start,
        checkInDate: booking.booking_start,
        checkOutDate: booking.booking_end,
        details: `${booking.accommodation?.accommodation_name || 'N/A'} (${booking.accommodation?.accommodation_type || 'N/A'})`,
        customer: booking.renter?.fullName || 'N/A',
        days: booking.booking_start && booking.booking_end
          ? Math.ceil((new Date(booking.booking_end) - new Date(booking.booking_start)) / (1000 * 60 * 60 * 24))
          : 0,
        amount: booking.totalPrice || 0,
        status: booking.booking_status?.toLowerCase() || 'unknown',
        isPaid: booking.paymentDetails?.paymentStatus === "completed" || booking.isPaid || false
      })),
      ...vehicleBookings.map(booking => ({
        id: booking._id,
        type: 'vehicle',
        date: booking.createdAt || booking.booking_start,
        details: `${booking.transport?.vehicle_name || booking.transport?.brand || 'N/A'} ${booking.transport?.model || 'N/A'} (${booking.transport?.vehicle_type || 'N/A'})`,
        customer: booking.renter?.fullName || 'N/A',
        days: booking.booking_start && booking.booking_end
          ? Math.ceil((new Date(booking.booking_end) - new Date(booking.booking_start)) / (1000 * 60 * 60 * 24))
          : 0,
        amount: booking.totalPrice || 0,
        status: booking.booking_status?.toLowerCase() || 'unknown',
        isPaid: booking.paymentDetails?.paymentStatus === "completed" || booking.isPaid || false
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
        description: `Booking for ${booking.accommodation?.accommodation_name || 'N/A'}`,
        date: booking.createdAt || booking.booking_start,
        status: booking.booking_status?.toLowerCase(),
        amount: booking.totalPrice
      })),
      ...vehicleBookings.slice(0, 3).map(booking => ({
        id: booking._id,
        type: 'vehicle',
        title: `Vehicle Booking ${booking.booking_status}`,
        description: `Booking for ${booking.transport?.vehicle_name || booking.transport?.brand || 'N/A'} ${booking.transport?.model || 'N/A'}`,
        date: booking.createdAt || booking.booking_start,
        status: booking.booking_status?.toLowerCase(),
        amount: booking.totalPrice
      })),
      ...owners.slice(0, 2).map(owner => ({
        id: owner._id,
        type: 'owner',
        title: `${owner.status === 'Blocked' ? 'Blocked' : 'Registered'} Owner`,
        description: `${owner.fullName || 'N/A'} - ${owner.email || 'N/A'}`,
        date: owner.createdAt || '2023-01-01',
        status: owner.status === 'Blocked' ? 'blocked' : 'active'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const recentActivities = getRecentActivities();

  // ----------------------- Get unique types for charts -----------------------
  const getAccommodationTypes = () => {
    const types = [...new Set(accommodations.map(acc => acc.accommodation_type))];
    return types.filter(type => type).length > 0 ? types : ['Single Bed', 'Double Bed', 'Other'];
  };

  const getVehicleTypes = () => {
    const types = [...new Set(vehicles.map(vehicle => vehicle.vehicle_type))];
    return types.filter(type => type).length > 0 ? types : ['Motorbike', 'Car', 'Scooter', 'Bicycle', 'Van', 'Truck', 'Other'];
  };

  // ----------------------- Render Method -----------------------
  if (isLoading) {
    return (
      <Loading text="Loading dashboard data..." />
    );
  }

  return (
    <div className="dashboard">
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* ----------------------- Header Section ----------------------- */}
      <div className="dashboard-header">
        <h1 className="title">Admin Dashboard</h1>
        <div className="header-actions">
          <button onClick={refreshData} className="refresh-button" disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* ----------------------- Navigation Tabs ----------------------- */}
      <nav className="tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'accommodations' ? 'active' : ''}`}
          onClick={() => setActiveTab('accommodations')}
        >
          Accommodations
        </button>
        <button
          className={`tab-button ${activeTab === 'transport' ? 'active' : ''}`}
          onClick={() => setActiveTab('transport')}
        >
          Transport
        </button>
        <button
          className={`tab-button ${activeTab === 'owners' ? 'active' : ''}`}
          onClick={() => setActiveTab('owners')}
        >
          Owners
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
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
                <span className="card-subtext">All completed bookings</span>
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
                      '--percentage': `${Math.round((bookingStats.accommodationStats.revenue / Math.max(bookingStats.totalRevenue, 1)) * 100)}%`,
                      '--color': '#3b82f6'
                    }}
                  ></div>
                  <div
                    className="chart-segment vehicles"
                    style={{
                      '--percentage': `${Math.round((bookingStats.vehicleStats.revenue / Math.max(bookingStats.totalRevenue, 1)) * 100)}%`,
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

            <div className="chart-card">
              <h3>Booking Status Distribution</h3>
              <div className="status-chart">
                <div className="status-bar confirmed">
                  <div className="status-label">Confirmed - </div>
                  <div className="status-count">{bookingStats.confirmedBookings}</div>
                </div>
                <div className="status-bar completed">
                  <div className="status-label">Completed - </div>
                  <div className="status-count">{bookingStats.completedBookings}</div>
                </div>
                <div className="status-bar cancelled">
                  <div className="status-label">Cancelled - </div>
                  <div className="status-count"> {bookingStats.cancelledBookings}</div>
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
                  <div key={`${activity.id}-${index}`} className={`activity-item`}>
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
            <div className="stat-card">
              <div>
                <h3>Revenue</h3>
                <p>{formatCurrency(bookingStats.accommodationStats.revenue)}</p>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>Accommodation Type Distribution</h3>
            <div className="bar-chart">
              {getAccommodationTypes().map(type => {
                const count = accommodations.filter(acc => acc.accommodation_type === type).length;
                const percentage = accommodationStats.totalAccommodations > 0 ? (count / accommodationStats.totalAccommodations) * 100 : 0;
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
                      <td className="booking-id">{booking._id?.substring(0, 8)}...</td>
                      <td>
                        <div>{booking.accommodation?.accommodation_name || 'N/A'}</div>
                        <div className="small-text">{booking.accommodation?.accommodation_type || 'N/A'}</div>
                      </td>
                      <td>{booking.renter?.fullName || 'N/A'}</td>
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
            <div className="stat-card">
              <div>
                <h3>Revenue</h3>
                <p>{formatCurrency(bookingStats.vehicleStats.revenue)}</p>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>Vehicle Type Distribution</h3>
            <div className="bar-chart">
              {getVehicleTypes().map(type => {
                const count = vehicles.filter(vehicle => vehicle.vehicle_type === type).length;
                const percentage = vehicleStats.totalVehicles > 0 ? (count / vehicleStats.totalVehicles) * 100 : 0;
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
                      <td className="booking-id">{booking._id?.substring(0, 8)}...</td>
                      <td>
                        <div>{booking.transport?.vehicle_name || booking.transport?.brand || 'N/A'} {booking.transport?.model || 'N/A'}</div>
                        <div className="small-text">{booking.transport?.vehicle_type || 'N/A'}</div>
                      </td>
                      <td>{booking.renter?.fullName || 'N/A'}</td>
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
                    '--percentage': `${Math.round((ownerStats.activeOwners / Math.max(ownerStats.totalOwners, 1)) * 100)}%`,
                    '--color': '#10b981'
                  }}
                ></div>
                <div
                  className="chart-segment blocked"
                  style={{
                    '--percentage': `${Math.round((ownerStats.blockedOwners / Math.max(ownerStats.totalOwners, 1)) * 100)}%`,
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
                    <tr key={owner._id}>
                      <td>
                        <div className="owner-info">
                          <img
                            src={owner.profile_pic
                              ? `http://localhost:5000${owner.profile_pic}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName || 'Owner')}&background=random&color=fff`
                            }
                            alt={owner.fullName || 'Owner'}
                            className="owner-avatar"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName || 'Owner')}&background=random&color=fff`;
                            }}
                          />
                          <span>{owner.fullName || 'N/A'}</span>
                        </div>
                      </td>
                      <td>{owner.email || 'N/A'}</td>
                      <td>
                        {accommodations.filter(acc =>
                          acc.owner_id === owner._id || acc.owner_id?._id === owner._id
                        ).length +
                          vehicles.filter(vehicle =>
                            vehicle.owner_id === owner._id || vehicle.owner_id?._id === owner._id
                          ).length}
                      </td>
                      <td>
                        <span className={`status-badge ${owner.status?.toLowerCase() || 'active'}`}>
                          {owner.status || 'Active'}
                        </span>
                      </td>
                      <td>{formatDate(owner.createdAt)}</td>
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
                <h3>Cancelled</h3>
                <p>{bookingStats.cancelledBookings}</p>
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
                  <span>Cancelled:</span>
                  <span>{bookingStats.accommodationStats.cancelled}</span>
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
                  <span>Cancelled:</span>
                  <span>{bookingStats.vehicleStats.cancelled}</span>
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
                        {booking.id?.substring(0, 8)}...
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
                        {booking.isPaid && <div className="small-text paid">Paid</div>}
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