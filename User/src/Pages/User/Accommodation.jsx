import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsData } from '../../Assets/assets';
import { FaTimes, FaFilter } from 'react-icons/fa';
import { scrollToTop } from '../scrollToTop';
import './Accommodation.css';

import AccommodationBanner from '../../Components/User/Accommodation/AccommodationBanner';
import FiltersSidebar from '../../Components/User/Accommodation/FiltersSidebar';
import ResultsHeader from '../../Components/User/Accommodation/ResultsHeader';
import RoomCard from '../../Components/User/Accommodation/RoomCard';
import Pagination from '../../Components/User/Accommodation/Pagination';

const Accommodation = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [savedRooms, setSavedRooms] = useState(() => {
    const saved = localStorage.getItem('savedRooms');
    return saved ? JSON.parse(saved) : [];
  });

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
    let result = [...roomsData];
    
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
    roomsData,
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
    scrollToTop();
  };

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
          <ResultsHeader count={filteredRooms.length} />

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