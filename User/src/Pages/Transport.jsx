import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../Components/Rating/StarRating';
import './Transport.css';
import { vehicleData } from '../Assets/assets';

// checkbox component for filters
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

// radio button component for sorting options
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

const Transport = () => {
  const navigate = useNavigate();

  // State for managing filters and pagination
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const transportsPerPage = 9;

  // Filter and sort options
  const vehicleTypes = ['Motorbike', 'Car', 'Van', 'Bus'];
  const priceRanges = ['0 to 2000', '2000 to 4000', '4000 to 6000'];
  const sortOptions = ['Price Low to High', 'Price High to Low', 'Seating Capacity'];

  // Handler for vehicle type filter changes
  const handleVehicleTypeChange = (checked, label) => {
    setSelectedVehicleTypes((prev) =>
      checked ? [...prev, label] : prev.filter((type) => type !== label)
    );
    setCurrentPage(1);
  };

  // Handler for price range filter changes
  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, label] : prev.filter((range) => range !== label)
    );
    setCurrentPage(1);
  };

  // Handler for sort option changes
  const handleSortChange = (label) => {
    setSelectedSortOption(label);
    setCurrentPage(1);
  };

  // Reset all filters to initial state
  const resetAllFilters = () => {
    setSelectedVehicleTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setCurrentPage(1);
  };

  // Filter and sort
  const filteredTransports = vehicleData
    .filter((vehicle) => {
      const matchesType =
        selectedVehicleTypes.length === 0 || selectedVehicleTypes.includes(vehicle.vehicle_type);
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          const [min, max] = range.split(' to ').map(Number);
          return vehicle.rental_price_per_day >= min && vehicle.rental_price_per_day <= max;
        });
      return matchesType && matchesPrice;
    })
    .sort((a, b) => {
      switch (selectedSortOption) {
        case 'Price Low to High':
          return a.rental_price_per_day - b.rental_price_per_day;
        case 'Price High to Low':
          return b.rental_price_per_day - a.rental_price_per_day;
        case 'Seating Capacity':
          return b.seating_capacity - a.seating_capacity;
        default:
          return 0;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransports.length / transportsPerPage);
  const startIdx = (currentPage - 1) * transportsPerPage;
  const endIdx = startIdx + transportsPerPage;
  const paginatedTransports = filteredTransports.slice(startIdx, endIdx);

  // Handler for page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="transport">
      {/* -------------------- Mobile filter toggle button --------------------*/}
      <div className="transport-header">
        <button
          className="mobile-filter-toggle"
          onClick={() => setOpenFilters(!openFilters)}
          aria-expanded={openFilters}
        >
          {openFilters ? (
            <>
              <span className="icon-close"></span> Hide Filters
            </>
          ) : (
            <>
              <span className="icon-filter"></span> Show Filters
            </>
          )}
        </button>
      </div>

      {/* Overlay for mobile filters */}
      <div className={`filter-overlay ${openFilters ? 'open' : ''}`} onClick={() => setOpenFilters(false)} />




      {/* -------------------- Main content container -------------------- */}
      <div className="transport-container">


        {/* -------------------- Filters sidebar -------------------- */}
        <aside className={`filters-sidebar ${openFilters ? 'open' : ''}`}>
          <button className="close-sidebar" onClick={() => setOpenFilters(false)} aria-label="Close filters">
            &times;
          </button>

          {/* Vehicle type filter section */}
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

          {/* Price range filter section */}
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

          {/* Sort options section */}
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

          {/* Reset all filters button */}
          <button
            className="resetButton"
            onClick={resetAllFilters}
            disabled={
              selectedVehicleTypes.length === 0 &&
              selectedPriceRanges.length === 0 &&
              selectedSortOption === ''
            }
          >
            Reset All Filters
          </button>
        </aside>



        {/* -------------------- Main transport listings -------------------- */}
        <main className="transports-list">
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
              {/* Transport cards */}
              {paginatedTransports.map((vehicle) => (
                <article
                  key={vehicle.vehicle_id}
                  className="transport-card"
                  onClick={() => navigate(`/transport/${vehicle.vehicle_id}`)}
                >
                  <div className="transport-image-container">
                    <img
                      src={vehicle.vehicle_images[0]}
                      alt={`${vehicle.vehicle_type} - ${vehicle.brand} ${vehicle.model}`}
                      className="transport-image"
                      loading="lazy"
                    />
                    <span className="transport-badge">{vehicle.vehicle_type}</span>
                  </div>

                  <div className="transport-card-content">
                    <div className="transport-info">
                      <div className="transport-header-info">
                        <h2 className="transport-title">
                          {vehicle.brand} {vehicle.model}
                        </h2>
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
                          navigate(`/transport/${vehicle.vehicle_id}`);
                        }}
                        aria-label={`View details for ${vehicle.brand} ${vehicle.model}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}




              {/* -------------------- Pagination controls -------------------- */}
              {totalPages > 1 && (
                <div className="pagination">
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