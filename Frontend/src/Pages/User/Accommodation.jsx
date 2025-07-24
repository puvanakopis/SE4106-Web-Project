import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { roomsDummyData } from '../../Assets/assets';
import { FaHeart, FaRegHeart, FaTimes, FaFilter } from 'react-icons/fa';
import { scrollToTop } from '../scrollToTop';
import './Accommodation.css';
import '../Animation/animations.css'



// --------------------------- Room card component ---------------------------
const RoomCard = ({ room, index, savedRooms, toggleSaveRoom, handleRoomClick }) => {
  const [cardRef, cardInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <article
      ref={cardRef}
      className={`room-card simple ${cardInView ? 'scale-up' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onClick={() => {
        handleRoomClick(room._id);
        scrollToTop();
      }}
    >
      <div className="room-image-container">
        <img
          src={room.images[0]}
          alt={`${room.roomType} room at ${room.hotel.name}`}
          className="room-image"
          loading="lazy"
        />
        <span className="room-badge">{room.roomType}</span>
        <button
          className={`save-button ${savedRooms.includes(room._id) ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveRoom(room._id, e);
          }}
          aria-label={savedRooms.includes(room._id) ? 'Remove from saved' : 'Save this room'}
        >
          {savedRooms.includes(room._id) ? (
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
              handleRoomClick(room._id);
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




const Accommodation = () => {
  // ------------------ Navigation and UI State ------------------
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  // ------------------ Saved Rooms State ------------------
  const [savedRooms, setSavedRooms] = useState(() => {
    const saved = localStorage.getItem('savedRooms');
    return saved ? JSON.parse(saved) : [];
  });

  // ------------------ Notification State ------------------
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isRemovedNotification, setIsRemovedNotification] = useState(false);

  // ------------------ Search Filter State ------------------
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // ------------------ Filter Options Constants ------------------
  const roomTypes = ['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'];
  const priceRanges = ['0 to 2500', '2500 to 5000', '5000 to 10000', '10000 to 15000'];
  const sortOptions = ['Price Low to High', 'Price High to Low'];

  // ------------------ Selected Filter State ------------------
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  // ------------------ Pagination State ------------------
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  // ------------------ Animation Hooks ------------------
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: false });
  const [resultsRef, resultsInView] = useInView({ threshold: 0.1, triggerOnce: false });
  const [filtersSidebarRef, filtersSidebarInView] = useInView({ threshold: 0.1, triggerOnce: false });
  const [filtersButtonRef, filtersButtonInView] = useInView({ threshold: 0.1, triggerOnce: false });




  /* ------------------ Filters and sorts rooms ------------------ */
  const filteredRooms = useMemo(() => {
    let result = [...roomsDummyData];

    // Apply text-based filters
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

    // Apply price range filters
    if (searchMinPrice) {
      result = result.filter(room => room.pricePerMonth >= Number(searchMinPrice));
    }

    if (searchMaxPrice) {
      result = result.filter(room => room.pricePerMonth <= Number(searchMaxPrice));
    }

    // Apply checkbox filters
    if (selectedRoomTypes.length > 0) {
      result = result.filter(room => selectedRoomTypes.includes(room.roomType));
    }

    if (selectedPriceRanges.length > 0) {
      result = result.filter(room =>
        selectedPriceRanges.some(range => {
          const [min, max] = range.replace('Rs ', '').split(' to ').map(Number);
          return room.pricePerMonth >= min && room.pricePerMonth <= max;
        })
      );
    }

    // Apply sorting
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



  // ------------------ Pagination calculations ------------------
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const paginatedRooms = useMemo(() => {
    const startIdx = (currentPage - 1) * roomsPerPage;
    return filteredRooms.slice(startIdx, startIdx + roomsPerPage);
  }, [filteredRooms, currentPage, roomsPerPage]);

  // Filter Handlers
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



  /* ------------------ Resets all filters to their initial state ------------------ */
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



  /* ------------------ Toggles a room's saved status ------------------ */
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



  /* ------------------ Handles pagination changes ------------------ */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  // ------------------ Handles room card click to navigate to details page ------------------
  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };


  // ------------------ Notification timeout effect ------------------
  useEffect(() => {
    if (showSavedNotification) {
      const timer = setTimeout(() => {
        setShowSavedNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSavedNotification]);


  // ------------------ Check if filters can be reset ------------------
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
      {/* --------------------------- Notification --------------------------- */}
      {showSavedNotification && (
        <div className="toast-notification" role="alert">
          <span className="toast-icon">
            {isRemovedNotification ? <FaRegHeart /> : <FaHeart />}
          </span>
          <span className="toast-message">{notificationMsg}</span>
          <button
            className="toast-close"
            onClick={() => setShowSavedNotification(false)}
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        </div>
      )}


      {/* --------------------------- Hero Section --------------------------- */}
      <section ref={heroRef} className={`accommodation-hero `} >
        <div className="accommodation-hero-content container">
          <h1 className={`hero-title ${heroInView ? 'slide-in-left' : ''}`}>
            Find the Ideal Room for You
          </h1>
          <p className={`hero-subtitle ${heroInView ? 'slide-in-right' : ''}`}>
            Smart filters. Trusted listings. Simplified campus life.
          </p>

          <form
            className={`accommodation-search-bar ${heroInView ? 'scale-up' : ''}`}
            onSubmit={(e) => e.preventDefault()}
          >
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


      {/* --------------------------- Mobile Filter Toggle --------------------------- */}
      <div className="accommodation-mobile-filter">
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


      {/* --------------------------- Accommodation Content --------------------------- */}
      <div className="accommodation-content">

        {/* --------------------------- Filters Sidebar --------------------------- */}
        <aside
          ref={filtersSidebarRef}
          className={`filters-sidebar ${openFilters || window.innerWidth > 768 ? 'open' : ''} ${filtersSidebarInView ? 'slide-in-left' : ''}`}
        >
          <div className={`filter-section ${filtersSidebarInView ? 'scale-up' : ''}`}>
            <h2 className="filter-section-title">Room Types</h2>
            <div className="filter-options">
              {roomTypes.map((room, i) => (
                <label key={`room-type-${i}`} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRoomTypes.includes(room)}
                    onChange={(e) => handleRoomTypeChange(e.target.checked, room)}
                    aria-label={room}
                  />
                  <span className="checkmark"></span>
                  <span className="filter-label">{room}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`filter-section ${filtersSidebarInView ? 'scale-up' : ''}`}>
            <h2 className="filter-section-title">Price Range</h2>
            <div className="filter-options">
              {priceRanges.map((range, i) => (
                <label key={`price-range-${i}`} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(`Rs ${range}`)}
                    onChange={(e) => handlePriceRangeChange(e.target.checked, range)}
                    aria-label={range}
                  />
                  <span className="checkmark"></span>
                  <span className="filter-label">{range}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`filter-section ${filtersSidebarInView ? 'scale-up' : ''}`}>
            <h2 className="filter-section-title">Sort By</h2>
            <div className="filter-options">
              {sortOptions.map((option, i) => (
                <label key={`sort-option-${i}`} className="filter-radio">
                  <input
                    type="radio"
                    name="sortOption"
                    checked={selectedSortOption === option}
                    onChange={() => handleSortChange(option)}
                    aria-label={option}
                  />
                  <span className="radiomark"></span>
                  <span className="filter-label">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            className={`resetButton ${filtersSidebarInView ? 'scale-up' : ''}`}
            onClick={resetAllFilters}
            disabled={!canResetFilters}
          >
            Reset All Filters
          </button>
        </aside>


        {openFilters && window.innerWidth <= 768 && (
          <div
            className="filters-overlay"
            onClick={() => setOpenFilters(false)}
          />
        )}




        <main className="rooms-list" ref={resultsRef}>

          {/* --------------------------- Rooms Counter --------------------------- */}
          <div className={`results-header full-width ${resultsInView ? 'slide-in-right' : ''}`}>
            <div className="results-header-content">
              <p className="results-count">
                Found <strong>{filteredRooms.length}</strong> Rooms
              </p>
            </div>
          </div>



          {/* ---------------------------  No Results Found --------------------------- */}
          {paginatedRooms.length === 0 ? (
            <div className={`no-results ${resultsInView ? 'scale-up' : ''}`}>
              <h3>No rooms found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>



              {/* ---------------------------  Rooms List --------------------------- */}
              {paginatedRooms.map((room, index) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  index={index}
                  savedRooms={savedRooms}
                  toggleSaveRoom={toggleSaveRoom}
                  handleRoomClick={handleRoomClick}
                />
              ))}



              {/* ---------------------------  Pagination --------------------------- */}
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

export default Accommodation;