import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import StarRating from '../../Components/Rating/StarRating';
import { vehicleData } from '../../Assets/assets';
import { FaHeart, FaRegHeart, FaTimes, FaFilter } from 'react-icons/fa';
import { scrollToTop } from '../scrollToTop';
import './Transport.css';

/* ------------- Reusable Components ------------- */
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
  <div className="toast-notification scale-up" role="alert">
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





/* ------------- Transport Card Component ------------- */
const TransportCard = ({ vehicle, index, savedVehicles, toggleSaveVehicle, handleVehicleClick }) => {
  const [cardRef, cardInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <article
      ref={cardRef}
      key={vehicle.vehicle_id}
      className={`transport-card ${cardInView ? 'scale-up' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onClick={() => {
        handleVehicleClick(vehicle.vehicle_id);
        scrollToTop();
      }}
    >
      {/* Vehicle Image Section */}
      <div className="transport-image-container">
        <img
          src={vehicle.vehicle_images[0]}
          alt={`${vehicle.vehicle_type} - ${vehicle.brand} ${vehicle.model}`}
          className="transport-image"
          loading="lazy"
        />
        <span className="transport-badge">{vehicle.vehicle_type}</span>
        <button
          className={`save-button ${savedVehicles.includes(vehicle.vehicle_id) ? 'saved' : ''}`}
          onClick={(e) => {
            toggleSaveVehicle(vehicle.vehicle_id, e);
            scrollToTop();
          }}
          aria-label={savedVehicles.includes(vehicle.vehicle_id) ? 'Remove from saved' : 'Save this vehicle'}
        >
          {savedVehicles.includes(vehicle.vehicle_id) ? (
            <FaHeart className="icon-heart-filled" />
          ) : (
            <FaRegHeart className="icon-heart-outline" />
          )}
        </button>
      </div>

      {/* Vehicle Info Section */}
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

        {/* Price Section */}
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
              scrollToTop();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};

/* ------------- Main Transport Component ------------- */
const Transport = () => {
  /* ------------- State Management ------------- */
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isRemovedNotification, setIsRemovedNotification] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const transportsPerPage = 9;






  
  /* ------------- Intersection Observer Hooks ------------- */
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: false });
  const [resultsRef, resultsInView] = useInView({ threshold: 0.1, triggerOnce: false });
  const [filtersSidebarRef, filtersSidebarInView] = useInView({ threshold: 0.1, triggerOnce: false });
  const [filtersButtonRef, filtersButtonInView] = useInView({ threshold: 0.1, triggerOnce: false });

  /* ------------- Constants ------------- */
  const vehicleTypes = ['Motorbike', 'Car', 'Van', 'Bus'];
  const priceRanges = ['0 to 2000', '2000 to 4000', '4000 to 6000'];
  const sortOptions = ['Price Low to High', 'Price High to Low', 'Seating Capacity'];

  /* ------------- Filter Logic ------------- */
  const filteredTransports = useMemo(() => {
    let result = [...vehicleData];

    // Name filter
    if (searchName.trim()) {
      result = result.filter(vehicle =>
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Type filter
    if (searchType.trim()) {
      result = result.filter(vehicle =>
        vehicle.vehicle_type.toLowerCase().includes(searchType.toLowerCase())
      );
    }

    // Price range filters
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

    // Vehicle type filters
    if (selectedVehicleTypes.length > 0) {
      result = result.filter(vehicle =>
        selectedVehicleTypes.includes(vehicle.vehicle_type)
      );
    }

    // Price range checkboxes
    if (selectedPriceRanges.length > 0) {
      result = result.filter(vehicle =>
        selectedPriceRanges.some(range => {
          const [min, max] = range.split(' to ').map(Number);
          return vehicle.rental_price_per_day >= min && vehicle.rental_price_per_day <= max;
        })
      );
    }

    // Sorting logic
    if (selectedSortOption === 'Price Low to High') {
      result.sort((a, b) => a.rental_price_per_day - b.rental_price_per_day);
    } else if (selectedSortOption === 'Price High to Low') {
      result.sort((a, b) => b.rental_price_per_day - a.rental_price_per_day);
    } else if (selectedSortOption === 'Seating Capacity') {
      result.sort((a, b) => b.seating_capacity - a.seating_capacity);
    }

    return result;
  }, [
    searchName,
    searchType,
    searchMinPrice,
    searchMaxPrice,
    selectedVehicleTypes,
    selectedPriceRanges,
    selectedSortOption
  ]);

  /* ------------- Pagination Logic ------------- */
  const totalPages = Math.ceil(filteredTransports.length / transportsPerPage);
  const paginatedTransports = useMemo(() => {
    const startIdx = (currentPage - 1) * transportsPerPage;
    return filteredTransports.slice(startIdx, startIdx + transportsPerPage);
  }, [filteredTransports, currentPage]);

  /* ------------- Event Handlers ------------- */
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

  /* ------------- Effects ------------- */
  useEffect(() => {
    if (showSavedNotification) {
      const timer = setTimeout(() => {
        setShowSavedNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSavedNotification]);

  /* ------------- Helper Functions ------------- */
  const canResetFilters = !(
    selectedVehicleTypes.length === 0 &&
    selectedPriceRanges.length === 0 &&
    selectedSortOption === '' &&
    !searchName &&
    !searchType &&
    !searchMinPrice &&
    !searchMaxPrice
  );

  /* ------------- Render Section ------------- */
  return (
    <div className="transport">
      {/* Notification Toast */}
      {showSavedNotification && (
        <NotificationToast
          message={notificationMsg}
          onClose={() => setShowSavedNotification(false)}
          isRemoved={isRemovedNotification}
        />
      )}

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`transport-hero ${heroInView ? 'slide-in-bottom' : ''}`}
      >
        <div className="transport-hero-content container">
          <h1 className={`hero-title ${heroInView ? 'slide-in-left' : ''}`}>
            Find Your Perfect Ride
          </h1>
          <p className={`hero-subtitle ${heroInView ? 'slide-in-right' : ''}`}>
            Quality vehicles. Flexible rentals. Hassle-free campus transportation.
          </p>

          {/* Search Bar */}
          <form
            className={`transport-search-bar ${heroInView ? 'scale-up' : ''}`}
            onSubmit={(e) => e.preventDefault()}
          >
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
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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

      {/* Filter Toggle Button */}
      <div className="transport-header">
        <button
          ref={filtersButtonRef}
          className={`mobile-filter-toggle ${filtersButtonInView ? 'slide-in-left' : ''}`}
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

      {/* Main Content Area */}
      <div className="transport-content">
        {/* Filters Sidebar */}
        <aside
          ref={filtersSidebarRef}
          className={`filters-sidebar ${openFilters || window.innerWidth > 768 ? 'open' : ''} ${filtersSidebarInView ? 'slide-in-left' : ''}`}
        >
          {/* Vehicle Type Filters */}
          <div className={`filter-section ${filtersSidebarInView ? 'scale-up' : ''}`}>
            <h2 className="filter-section-title">Vehicle Types</h2>
            <div className="filter-options">
              {vehicleTypes.map((vehicle) => (
                <CheckBox
                  key={`vehicle-type-${vehicle}`}
                  label={vehicle}
                  selected={selectedVehicleTypes.includes(vehicle)}
                  onChange={handleVehicleTypeChange}
                />
              ))}
            </div>
          </div>

          {/* Price Range Filters */}
          <div className={`filter-section ${filtersSidebarInView ? 'scale-up' : ''}`}>
            <h2 className="filter-section-title">Price Range (per day)</h2>
            <div className="filter-options">
              {priceRanges.map((range) => (
                <CheckBox
                  key={`price-range-${range}`}
                  label={range}
                  selected={selectedPriceRanges.includes(range)}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className={`filter-section ${filtersSidebarInView ? 'scale-up' : ''}`}>
            <h2 className="filter-section-title">Sort By</h2>
            <div className="filter-options">
              {sortOptions.map((option) => (
                <RadioButton
                  key={`sort-option-${option}`}
                  label={option}
                  selected={selectedSortOption === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            className={`resetButton ${filtersSidebarInView ? 'scale-up' : ''}`}
            onClick={resetAllFilters}
            disabled={!canResetFilters}
          >
            Reset All Filters
          </button>
        </aside>

        {/* Filters Overlay (Mobile) */}
        {openFilters && window.innerWidth <= 768 && (
          <div
            className="filters-overlay"
            onClick={() => setOpenFilters(false)}
          />
        )}

        {/* Vehicles List */}
        <main className="transports-list" ref={resultsRef}>
          {/* Results Header */}
          <div className={`results-header full-width ${resultsInView ? 'slide-in-right' : ''}`}>
            <div className="results-header-content">
              <p className="results-count">
                Found <strong>{filteredTransports.length}</strong> Vehicles
              </p>
            </div>
          </div>

          {/* Results List or Empty State */}
          {paginatedTransports.length === 0 ? (
            <div className={`no-results ${resultsInView ? 'scale-up' : ''}`}>
              <h3>No vehicles found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Vehicle Cards */}
              {paginatedTransports.map((vehicle, index) => (
                <TransportCard
                  key={vehicle.vehicle_id}
                  vehicle={vehicle}
                  index={index}
                  savedVehicles={savedVehicles}
                  toggleSaveVehicle={toggleSaveVehicle}
                  handleVehicleClick={handleVehicleClick}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`pagination ${resultsInView ? 'slide-in-right' : ''}`}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-arrow"
                    aria-label="Previous page"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => handlePageChange(i + 1)}
                      className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                      aria-label={`Page ${i + 1}`}
                      aria-current={currentPage === i + 1 ? 'page' : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-arrow"
                    aria-label="Next page"
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