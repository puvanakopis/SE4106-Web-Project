import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, roomsDummyData, facilityIcons } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';
import './Accommodation.css';

// Custom checkbox component for filters
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

// Custom radio button component for sorting options
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

// Main Accommodation component
const Accommodation = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  // Filter options
  const roomTypes = ['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'];
  const priceRanges = ['0 to 2500', '2500 to 5000', '5000 to 10000', '10000 to 15000'];
  const sortOptions = ['Price Low to High', 'Price High to Low'];

  // State for selected filters and sorting
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  // Handle room type checkbox changes
  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes((prev) =>
      checked ? [...prev, label] : prev.filter((type) => type !== label)
    );
    setCurrentPage(1);
  };

  // Handle price range checkbox changes
  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, `Rs ${label}`] : prev.filter((range) => range !== `Rs ${label}`)
    );
    setCurrentPage(1);
  };

  // Handle sort option radio button changes
  const handleSortChange = (label) => {
    setSelectedSortOption(label);
    setCurrentPage(1);
  };

  // Reset all filters and sorting
  const resetAllFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setCurrentPage(1);
  };

  // Apply filtering and sorting to the rooms data
  const filteredRooms = roomsDummyData
    .filter((room) => {
      const matchesType =
        selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.roomType);

      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          const [min, max] = range.replace('Rs ', '').split(' to ').map(Number);
          return room.pricePerMonth >= min && room.pricePerMonth <= max;
        });

      return matchesType && matchesPrice;
    })
    // Apply sorting based on selected option
    .sort((a, b) => {
      switch (selectedSortOption) {
        case 'Price Low to High':
          return a.pricePerMonth - b.pricePerMonth;
        case 'Price High to Low':
          return b.pricePerMonth - a.pricePerMonth;
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const startIdx = (currentPage - 1) * roomsPerPage;
  const endIdx = startIdx + roomsPerPage;
  const paginatedRooms = filteredRooms.slice(startIdx, endIdx);

  // Change current page
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="accommodation">
      {/* Mobile filter toggle */}
      <div className="accommodation-header">
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


      {/* -------------- Filter -------------- */}

      <div className="accommodation-content">
        {/* Room Types Filter */}
        <aside className={`filters-sidebar ${openFilters ? 'open' : ''}`}>
          {/* Room Types Filter */}
          <div className="filter-section">
            <h2 className="filter-section-title">Room Types</h2>
            <div className="filter-options">
              {roomTypes.map((room, i) => (
                <CheckBox
                  key={`room-type-${i}`}
                  label={room}
                  selected={selectedRoomTypes.includes(room)}
                  onChange={handleRoomTypeChange}
                />
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h2 className="filter-section-title">Price Range</h2>
            <div className="filter-options">
              {priceRanges.map((range, i) => (
                <CheckBox
                  key={`price-range-${i}`}
                  label={`Rs ${range}`}
                  selected={selectedPriceRanges.includes(`Rs ${range}`)}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>
          </div>

          {/* Sort Options */}
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

          {/* Reset All Filters Button */}
          <button
            className="resetButton"
            onClick={resetAllFilters}
            disabled={selectedRoomTypes.length === 0 &&
              selectedPriceRanges.length === 0 &&
              selectedSortOption === ''}
          >
            Reset All Filters
          </button>
        </aside>



        {/* -------------- Main Room List -------------- */}
        <main className="rooms-list">
          {/* No results message */}
          {paginatedRooms.length === 0 ? (
            <div className="no-results">
              <h3>No rooms found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button
                className="reset-filters"
                onClick={resetAllFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>


              {paginatedRooms.map((room) => (
                <article
                  key={room._id}
                  className="room-card"
                  onClick={() => navigate(`/room/${room._id}`)}
                >
                  {/* Room image with badge */}
                  <div className="room-image-container">
                    <img
                      src={room.images[0]}
                      alt={`${room.roomType} room at ${room.hotel.name}`}
                      className="room-image"
                      loading="lazy"
                    />
                    <span className="room-badge">{room.roomType}</span>
                  </div>

                  {/* Room details */}
                  <div className="room-content">
                    <div className="room-info">
                      <h2 className="room-title">{room.hotel.name}</h2>
                      <div className="room-location">
                        <img src={assets.locationIcon} alt="" aria-hidden="true" />
                        <span>{room.hotel.city}, {room.hotel.address}</span>
                      </div>
                      <div className="room-rating">
                        <StarRating rating={room.rating} />
                        <span className="reviews">200+ reviews</span>
                      </div>

                      {/* Room amenities preview */}
                      <div className="room-amenities">
                        {room.amenities.slice(0, 4).map((item, index) => (
                          <div key={`amenity-${index}`} className="amenity-tag">
                            <img src={facilityIcons[item]} alt="" aria-hidden="true" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and action button */}
                    <div className="room-price-section">
                      <div className="price-info">
                        <p className="price-per-month">Rs {room.pricePerMonth.toLocaleString()}</p>
                        <p className="price-period">/ month</p>
                      </div>
                      <button

                        // onClick={() => navigate(`/room/${room._id}`)}
                        // className="mt-2 sm:mt-0 bg-blue-600 text-white px-5 py-2 rounded-xs hover:bg-blue-700 text-sm transition duration-200"

                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/room/${room._id}`);
                        }}
                        aria-label={`View details for ${room.roomType} room`}

                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* -------------- Pagination controls -------------- */}
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

export default Accommodation;