import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../Components/Rating/StarRating';
import { vehicleData } from '../Assets/assets';
import { FaHeart, FaRegHeart, FaTimes, FaFilter } from 'react-icons/fa';
import { scrollToTop } from './scrollToTop'
import './Transport.css';

// Reusable Components
const CheckBox = ({ label, selected = false, onChange = () => { } }) => (
  <label className="filter-checkbox">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
      aria-label={label}
    />
    <span className="checkmark"></span>
    <span className="filter-label">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => { } }) => (
  <label className="filter-radio">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
      aria-label={label}
    />
    <span className="radiomark"></span>
    <span className="filter-label">{label}</span>
  </label>
);

const NotificationToast = ({ message, onClose, isRemoved }) => (
  <div className="toast-notification" role="alert">
    <span className="toast-icon">
      {isRemoved ? <FaRegHeart /> : <FaHeart />}
    </span>
    <span className="toast-message">{message}</span>
    <button
      className="toast-close"
      onClick={onClose}
      aria-label="Close notification"
    >
      <FaTimes />
    </button>
  </div>
);

const TransportBanner = ({
  searchName,
  setSearchName,
  searchType,
  setSearchType,
  setSearchMinPrice,
  setSearchMaxPrice,
}) => (
  <section className="transport-hero">
    <div className="transport-hero-content container">
      <h1 className="hero-title">Find Your Perfect Ride</h1>
      <p className="hero-subtitle">
        Quality vehicles. Flexible rentals. Hassle-free campus transportation.
      </p>

      <form className="transport-search-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search by Vehicle Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="transport-search-input"
          aria-label="Vehicle name"
        />

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="transport-search-select"
          aria-label="Vehicle Type"
        >
          <option value="">Vehicle Type</option>
          <option value="Motorbike">Motorbike</option>
          <option value="Car">Car</option>
          <option value="Van">Van</option>
          <option value="Bus">Bus</option>
        </select>

        <select
          onChange={(e) => {
            const [min, max] = e.target.value.split('-');
            setSearchMinPrice(min);
            setSearchMaxPrice(max);
          }}
          className="transport-search-select"
          aria-label="Price Range"
        >
          <option value="">Price Range</option>
          <option value="0-2000">0 - 2,000</option>
          <option value="2000-4000">2,000 - 4,000</option>
          <option value="4000-6000">4,000 - 6,000</option>
        </select>

        <button type="submit" className="transport-search-btn">
          Search
        </button>
      </form>
    </div>
  </section>
);

const Transport = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isRemovedNotification, setIsRemovedNotification] = useState(false);

  // Search and filter states
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // Filter options
  const vehicleTypes = ['Motorbike', 'Car', 'Van', 'Bus'];
  const priceRanges = ['0 to 2000', '2000 to 4000', '4000 to 6000'];
  const sortOptions = ['Price Low to High', 'Price High to Low', 'Seating Capacity'];

  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transportsPerPage = 9;

  // Filter and sort vehicles
  const filteredTransports = useMemo(() => {
    let result = [...vehicleData];

    if (searchName.trim()) {
      result = result.filter(vehicle =>
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchType.trim()) {
      result = result.filter(vehicle =>
        vehicle.vehicle_type.toLowerCase().includes(searchType.toLowerCase())
      );
    }

    if (searchMinPrice) {
      result = result.filter(vehicle =>
        vehicle.rental_price_per_day >= Number(searchMinPrice)
      );
    }

    if (searchMaxPrice) {
      result = result.filter(vehicle =>
        vehicle.rental_price_per_day <= Number(searchMaxPrice)
      );
    }

    if (selectedVehicleTypes.length > 0) {
      result = result.filter(vehicle =>
        selectedVehicleTypes.includes(vehicle.vehicle_type)
      );
    }

    if (selectedPriceRanges.length > 0) {
      result = result.filter(vehicle =>
        selectedPriceRanges.some(range => {
          const [min, max] = range.split(' to ').map(Number);
          return vehicle.rental_price_per_day >= min && vehicle.rental_price_per_day <= max;
        })
      );
    }

    if (selectedSortOption === 'Price Low to High') {
      result.sort((a, b) => a.rental_price_per_day - b.rental_price_per_day);
    } else if (selectedSortOption === 'Price High to Low') {
      result.sort((a, b) => b.rental_price_per_day - a.rental_price_per_day);
    } else if (selectedSortOption === 'Seating Capacity') {
      result.sort((a, b) => b.seating_capacity - a.seating_capacity);
    }

    return result;
  }, [
    vehicleData,
    searchName,
    searchType,
    searchMinPrice,
    searchMaxPrice,
    selectedVehicleTypes,
    selectedPriceRanges,
    selectedSortOption
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTransports.length / transportsPerPage);
  const paginatedTransports = useMemo(() => {
    const startIdx = (currentPage - 1) * transportsPerPage;
    return filteredTransports.slice(startIdx, startIdx + transportsPerPage);
  }, [filteredTransports, currentPage, transportsPerPage]);

  // Handlers
  const handleVehicleTypeChange = (checked, label) => {
    setSelectedVehicleTypes(prev =>
      checked ? [...prev, label] : prev.filter(type => type !== label)
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges(prev =>
      checked ? [...prev, label] : prev.filter(range => range !== label)
    );
    setCurrentPage(1);
  };

  const handleSortChange = (label) => {
    setSelectedSortOption(label);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedVehicleTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setSearchName('');
    setSearchType('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
    setCurrentPage(1);
  };

  const toggleSaveVehicle = (vehicleId, e) => {
    e.stopPropagation();
    setSavedVehicles(prev => {
      const isSaved = prev.includes(vehicleId);
      const newSaved = isSaved
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId];
      localStorage.setItem('savedVehicles', JSON.stringify(newSaved));
      setNotificationMsg(isSaved ? 'Vehicle removed from saved' : 'Vehicle saved!');
      setIsRemovedNotification(isSaved);
      setShowSavedNotification(true);
      return newSaved;
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleVehicleClick = (vehicleId) => {
    navigate(`/transport/${vehicleId}`);
  };

  // Notification effect
  useEffect(() => {
    if (showSavedNotification) {
      const timer = setTimeout(() => {
        setShowSavedNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSavedNotification]);

  const canResetFilters = !(
    selectedVehicleTypes.length === 0 &&
    selectedPriceRanges.length === 0 &&
    selectedSortOption === '' &&
    !searchName &&
    !searchType &&
    !searchMinPrice &&
    !searchMaxPrice
  );

  return (
    <div className="transport">
      {showSavedNotification && (
        <NotificationToast
          message={notificationMsg}
          onClose={() => setShowSavedNotification(false)}
          isRemoved={isRemovedNotification}
        />
      )}

      <TransportBanner
        searchName={searchName}
        setSearchName={setSearchName}
        searchType={searchType}
        setSearchType={setSearchType}
        setSearchMinPrice={setSearchMinPrice}
        setSearchMaxPrice={setSearchMaxPrice}
      />

      <div className="transport-header">
        <button
          className="mobile-filter-toggle"
          onClick={() => setOpenFilters(!openFilters)}
          aria-expanded={openFilters}
        >
          {openFilters ? (
            <>
              <FaTimes className="icon-close" /> Hide Filters
            </>
          ) : (
            <>
              <FaFilter className="icon-filter" /> Show Filters
            </>
          )}
        </button>
      </div>

      <div className="transport-content">
        <aside
          className={`filters-sidebar ${openFilters ? 'open' : ''}`}
          aria-label="Filters"
        >
          <div className="filter-section">
            <h2 className="filter-section-title">Vehicle Types</h2>
            <div className="filter-options">
              {vehicleTypes.map((vehicle, i) => (
                <CheckBox
                  key={`vehicle-type-${i}`}
                  label={vehicle}
                  selected={selectedVehicleTypes.includes(vehicle)}
                  onChange={handleVehicleTypeChange}
                />
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h2 className="filter-section-title">Price Range (per day)</h2>
            <div className="filter-options">
              {priceRanges.map((range, i) => (
                <CheckBox
                  key={`price-range-${i}`}
                  label={range}
                  selected={selectedPriceRanges.includes(range)}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h2 className="filter-section-title">Sort By</h2>
            <div className="filter-options">
              {sortOptions.map((option, i) => (
                <RadioButton
                  key={`sort-option-${i}`}
                  label={option}
                  selected={selectedSortOption === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>

          <button
            className="resetButton"
            onClick={resetAllFilters}
            disabled={!canResetFilters}
          >
            Reset All Filters
          </button>
        </aside>

        {openFilters && (
          <div
            className="filters-overlay"
            onClick={() => setOpenFilters(false)}
          />
        )}

        <main className="transports-list">
          <div className="results-header full-width">
            <div className="results-header-content">
              <p className="results-count">
                Found <strong>{filteredTransports.length}</strong> Vehicles
              </p>
            </div>
          </div>

          {paginatedTransports.length === 0 ? (
            <div className="no-results">
              <h3>No vehicles found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {paginatedTransports.map(vehicle => (
                <article
                  key={vehicle.vehicle_id}
                  className="transport-card"
                  onClick={() => {
                    handleVehicleClick(vehicle.vehicle_id);
                    scrollToTop();
                  }}
                >
                  <div className="transport-image-container">
                    <img
                      src={vehicle.vehicle_images[0]}
                      alt={`${vehicle.vehicle_type} - ${vehicle.brand} ${vehicle.model}`}
                      className="transport-image"
                    />
                    <span className="transport-badge">{vehicle.vehicle_type}</span>
                    <button
                      className={`save-button ${savedVehicles.includes(vehicle.vehicle_id) ? 'saved' : ''}`}
                      onClick={(e) => {
                        toggleSaveVehicle(vehicle.vehicle_id, e)
                        scrollToTop()
                      }
                      }
                    >
                      {savedVehicles.includes(vehicle.vehicle_id) ? (
                        <FaHeart className="icon-heart-filled" />
                      ) : (
                        <FaRegHeart className="icon-heart-outline" />
                      )}
                    </button>
                  </div>

                  <div className="transport-card-content">
                    <div className="transport-info">
                      <div className="transport-header-info">
                        <h2 className="transport-title">{vehicle.brand} {vehicle.model}</h2>
                      </div>
                      <div className="transport-specs">
                        <div className="spec-item">
                          <div className="transport-rating">
                            <StarRating rating={vehicle.average_rating} />
                            <span className="reviews">50+ reviews</span>
                          </div>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Fuel:</span>
                          <span className="spec-value">{vehicle.fuel_type}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Seats:</span>
                          <span className="spec-value">{vehicle.seating_capacity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="transport-price-section">
                      <div className="price-info">
                        <p className="price">Rs {vehicle.rental_price_per_day.toLocaleString()}</p>
                        <p className="price-per">per day</p>
                      </div>
                      <button
                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVehicleClick(vehicle.vehicle_id);
                          scrollToTop()
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {totalPages > 1 && (
                <div className="pagination" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-arrow"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => handlePageChange(i + 1)}
                      className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-arrow"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Transport;