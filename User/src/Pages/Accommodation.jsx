import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsDummyData } from '../Assets/assets';
import { FaHeart, FaRegHeart, FaTimes, FaFilter } from 'react-icons/fa';
import './Accommodation.css';

// Reusable Components
const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
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

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
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

const RoomCard = ({ room, saved, onSave, onClick }) => (
  <article className="room-card simple" onClick={onClick}>
    <div className="room-image-container">
      <img
        src={room.images[0]}
        alt={`${room.roomType} room at ${room.hotel.name}`}
        className="room-image"
        loading="lazy"
      />
      <span className="room-badge">{room.roomType}</span>
      <button
        className={`save-button ${saved ? 'saved' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSave(room._id, e);
        }}
        aria-label={saved ? 'Remove from saved' : 'Save this room'}
      >
        {saved ? (
          <FaHeart className="icon-heart-filled" />
        ) : (
          <FaRegHeart className="icon-heart-outline" />
        )}
      </button>
    </div>
    <div className="room-simple-content full">
      <div className="room-main-info">
        <h2 className="room-title">
          {room.roomType} room at {room.hotel.name}
        </h2>
        <div className="room-hotel-name">{room.hotel.name}</div>
        <div className="room-address">
          {room.hotel.city}, {room.hotel.address}
        </div>
      </div>
      <div className="room-rating-reviews">
        <div className="room-rating-icons">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="star-icon">★</span>
          ))}
        </div>
        <span className="reviews">200+ reviews</span>
      </div>
      <div className="room-amenities-preview">
        {room.amenities.slice(0, 3).map((item, index) => (
          <span key={index} className="amenity-tag">{item}</span>
        ))}
      </div>
      <div className="room-bottom-row">
        <div className="room-price-simple">
          Rs {room.pricePerMonth.toLocaleString()}{' '}
          <span className="price-period">/ month</span>
        </div>
        <button
          className="view-details-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  </article>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="pagination-arrow"
      aria-label="Previous page"
    >
      &lt;
    </button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={`page-${i + 1}`}
        onClick={() => onPageChange(i + 1)}
        className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
        aria-label={`Page ${i + 1}`}
        aria-current={currentPage === i + 1 ? 'page' : undefined}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="pagination-arrow"
      aria-label="Next page"
    >
      &gt;
    </button>
  </div>
);

const FiltersSidebar = ({
  open,
  roomTypes,
  priceRanges,
  sortOptions,
  selectedRoomTypes,
  selectedPriceRanges,
  selectedSortOption,
  onRoomTypeChange,
  onPriceRangeChange,
  onSortChange,
  onResetFilters,
  canReset
}) => (
  <aside className={`filters-sidebar ${open ? 'open' : ''}`}>
    <div className="filter-section">
      <h2 className="filter-section-title">Room Types</h2>
      <div className="filter-options">
        {roomTypes.map((room, i) => (
          <CheckBox
            key={`room-type-${i}`}
            label={room}
            selected={selectedRoomTypes.includes(room)}
            onChange={onRoomTypeChange}
          />
        ))}
      </div>
    </div>

    <div className="filter-section">
      <h2 className="filter-section-title">Price Range</h2>
      <div className="filter-options">
        {priceRanges.map((range, i) => (
          <CheckBox
            key={`price-range-${i}`}
            label={range}
            selected={selectedPriceRanges.includes(`Rs ${range}`)}
            onChange={onPriceRangeChange}
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
            onChange={onSortChange}
          />
        ))}
      </div>
    </div>

    <button
      className="resetButton"
      onClick={onResetFilters}
      disabled={!canReset}
    >
      Reset All Filters
    </button>
  </aside>
);

const AccommodationBanner = ({
  searchName,
  setSearchName,
  searchType,
  setSearchType,
  setSearchMinPrice,
  setSearchMaxPrice,
}) => (
  <section className="accommodation-hero">
    <div className="accommodation-hero-content container">
      <h1 className="hero-title">Find the Ideal Room for You</h1>
      <p className="hero-subtitle">
        Smart filters. Trusted listings. Simplified campus life.
      </p>

      <form className="accommodation-search-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search by Accommodation Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="accommodation-search-input"
          aria-label="Hotel name"
        />

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="accommodation-search-select"
          aria-label="Room Type"
        >
          <option value="">Room Type</option>
          <option value="Single Bed">Single Bed</option>
          <option value="Double Bed">Double Bed</option>
          <option value="Triple Sharing">Triple Sharing</option>
          <option value="Annexe">Annexe</option>
        </select>

        <select
          onChange={(e) => {
            const [min, max] = e.target.value.split('-');
            setSearchMinPrice(min);
            setSearchMaxPrice(max);
          }}
          className="accommodation-search-select"
          aria-label="Price Range"
        >
          <option value="">Price Range</option>
          <option value="0-2500">0 - 2,500</option>
          <option value="2500-5000">2,500 - 5,000</option>
          <option value="5000-10000">5,000 - 10,000</option>
          <option value="10000-15000">10,000 - 15,000</option>
        </select>

        <button type="submit" className="btn accommodation-search-btn">
          Search
        </button>
      </form>
    </div>
  </section>
);

// Main Accommodation Component
const Accommodation = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [savedRooms, setSavedRooms] = useState(() => {
    const saved = localStorage.getItem('savedRooms');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isRemovedNotification, setIsRemovedNotification] = useState(false);

  // Search and filter states
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // Filter options
  const roomTypes = ['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'];
  const priceRanges = ['0 to 2500', '2500 to 5000', '5000 to 10000', '10000 to 15000'];
  const sortOptions = ['Price Low to High', 'Price High to Low'];

  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let result = [...roomsDummyData];
    
    if (searchName.trim()) {
      result = result.filter(room => 
        room.hotel.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    
    if (searchCity.trim()) {
      result = result.filter(room => 
        room.hotel.city.toLowerCase().includes(searchCity.toLowerCase())
      );
    }
    
    if (searchType.trim()) {
      result = result.filter(room => 
        room.roomType.toLowerCase().includes(searchType.toLowerCase())
      );
    }
    
    if (searchMinPrice) {
      result = result.filter(room => 
        room.pricePerMonth >= Number(searchMinPrice)
      );
    }
    
    if (searchMaxPrice) {
      result = result.filter(room => 
        room.pricePerMonth <= Number(searchMaxPrice)
      );
    }
    
    if (selectedRoomTypes.length > 0) {
      result = result.filter(room => 
        selectedRoomTypes.includes(room.roomType)
      );
    }
    
    if (selectedPriceRanges.length > 0) {
      result = result.filter(room => 
        selectedPriceRanges.some(range => {
          const [min, max] = range.replace('Rs ', '').split(' to ').map(Number);
          return room.pricePerMonth >= min && room.pricePerMonth <= max;
        })
      );
    }
    
    if (selectedSortOption === 'Price Low to High') {
      result.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
    } else if (selectedSortOption === 'Price High to Low') {
      result.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
    }
    
    return result;
  }, [
    roomsDummyData,
    searchName,
    searchCity,
    searchType,
    searchMinPrice,
    searchMaxPrice,
    selectedRoomTypes,
    selectedPriceRanges,
    selectedSortOption
  ]);


  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const paginatedRooms = useMemo(() => {
    const startIdx = (currentPage - 1) * roomsPerPage;
    return filteredRooms.slice(startIdx, startIdx + roomsPerPage);
  }, [filteredRooms, currentPage, roomsPerPage]);

  // Handlers
  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes(prev =>
      checked ? [...prev, label] : prev.filter(type => type !== label)
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges(prev =>
      checked ? [...prev, `Rs ${label}`] : prev.filter(range => range !== `Rs ${label}`)
    );
    setCurrentPage(1);
  };

  const handleSortChange = (label) => {
    setSelectedSortOption(label);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setSearchName('');
    setSearchCity('');
    setSearchType('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
    setCurrentPage(1);
  };

  const toggleSaveRoom = (roomId, e) => {
    e.stopPropagation();
    setSavedRooms(prev => {
      const isSaved = prev.includes(roomId);
      const newSaved = isSaved
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId];
      localStorage.setItem('savedRooms', JSON.stringify(newSaved));
      setNotificationMsg(isSaved ? 'Room removed from saved' : 'Room saved!');
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

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
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
    selectedRoomTypes.length === 0 &&
    selectedPriceRanges.length === 0 &&
    selectedSortOption === '' &&
    !searchName &&
    !searchCity &&
    !searchType &&
    !searchMinPrice &&
    !searchMaxPrice
  );

  return (
    <div className="accommodation">
      {showSavedNotification && (
        <NotificationToast
          message={notificationMsg}
          onClose={() => setShowSavedNotification(false)}
          isRemoved={isRemovedNotification}
        />
      )}

      <AccommodationBanner
        searchName={searchName}
        setSearchName={setSearchName}
        searchType={searchType}
        setSearchType={setSearchType}
        setSearchMinPrice={setSearchMinPrice}
        setSearchMaxPrice={setSearchMaxPrice}
      />

      <div className="accommodation-header">
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

      <div className="accommodation-content">
        <FiltersSidebar
          open={openFilters}
          roomTypes={roomTypes}
          priceRanges={priceRanges}
          sortOptions={sortOptions}
          selectedRoomTypes={selectedRoomTypes}
          selectedPriceRanges={selectedPriceRanges}
          selectedSortOption={selectedSortOption}
          onRoomTypeChange={handleRoomTypeChange}
          onPriceRangeChange={handlePriceRangeChange}
          onSortChange={handleSortChange}
          onResetFilters={resetAllFilters}
          canReset={canResetFilters}
        />

        {openFilters && (
          <div 
            className="filters-overlay"
            onClick={() => setOpenFilters(false)}
          />
        )}

        <main className="rooms-list">
          <div className="results-header full-width">
            <div className="results-header-content">
              <p className="results-count">
                Found <strong>{filteredRooms.length}</strong> Rooms
              </p>
            </div>
          </div>

          {paginatedRooms.length === 0 ? (
            <div className="no-results">
              <h3>No rooms found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {paginatedRooms.map(room => (
                <RoomCard
                  key={room._id}
                  room={room}
                  saved={savedRooms.includes(room._id)}
                  onSave={toggleSaveRoom}
                  onClick={() => handleRoomClick(room._id)}
                />
              ))}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Accommodation;