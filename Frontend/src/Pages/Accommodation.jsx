// src/Pages/Accommodation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, roomsDummyData, facilityIcons } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-2 items-center cursor-pointer mt-1 text-sm">
    <input
      type="checkbox"
      className="accent-blue-600"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
      aria-label={label}
    />
    <span className="select-none">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-2 items-center cursor-pointer mt-1 text-sm">
    <input
      type="radio"
      name="sortOption"
      className="accent-blue-600"
      checked={selected}
      onChange={() => onChange(label)}
      aria-label={label}
    />
    <span className="select-none">{label}</span>
  </label>
);

const Accommodation = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  const roomTypes = ['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'];
  const priceRanges = ['0 to 2500', '2500 to 5000', '5000 to 10000', '10000 to 15000'];
  const sortOptions = ['Price Low to High', 'Price High to Low'];

  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes((prev) =>
      checked ? [...prev, label] : prev.filter((type) => type !== label)
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, label] : prev.filter((range) => range !== label)
    );
    setCurrentPage(1);
  };

  const handleSortChange = (label) => {
    setSelectedSortOption(label);
    setCurrentPage(1);
  };

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="h-6" />

      <div className="flex flex-col lg:flex-row items-start gap-8 px-4 md:px-10 lg:px-16 xl:px-24 pb-10">
        {/* Filters */}
        <div className="bg-white w-72 border border-gray-300 text-gray-600 max-lg:mb-6 min-lg:mt-14 text-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
            <p className="font-medium text-gray-800">FILTERS</p>
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden text-xs cursor-pointer"
            >
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
          </div>

          <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden`}>
            <div className="px-4 py-3">
              <p className="font-medium text-gray-800 pb-1">Popular Filters</p>
              {roomTypes.map((room, i) => (
                <CheckBox
                  key={i}
                  label={room}
                  selected={selectedRoomTypes.includes(room)}
                  onChange={handleRoomTypeChange}
                />
              ))}
            </div>
            <div className="px-4 py-3">
              <p className="font-medium text-gray-800 pb-1">Price Range</p>
              {priceRanges.map((range, i) => (
                <CheckBox
                  key={i}
                  label={`Rs ${range}`}
                  selected={selectedPriceRanges.includes(`Rs ${range}`)}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>
            <div className="px-4 py-3 pb-5">
              <p className="font-medium text-gray-800 pb-1">Sort By</p>
              {sortOptions.map((option, i) => (
                <RadioButton
                  key={i}
                  label={option}
                  selected={selectedSortOption === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Room Listings */}
        <section className="flex-1">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            All Rooms
          </h2>

          {paginatedRooms.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              No rooms found matching your criteria.
            </p>
          ) : (
            paginatedRooms.map((room) => (
              <div
                key={room._id}
                className="bg-white mb-6 p-5 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-2/5">
                    <img
                      src={room.images[0]}
                      alt="Room"
                      loading="lazy"
                      onClick={() => {
                        navigate(`/room/${room._id}`);
                        scrollTo(0, 0);
                      }}
                      className="w-full h-44 md:h-52 rounded-md object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>

                  <div className="md:w-3/5 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{room.hotel.city}</p>
                      <h3
                        onClick={() => navigate(`/room/${room._id}`)}
                        className="text-lg font-semibold font-playfair text-gray-800 cursor-pointer hover:underline"
                      >
                        {room.hotel.name}
                      </h3>

                      <div className="flex items-center mt-1 text-xs text-gray-600">
                        <StarRating rating={room.rating} />
                        <span className="ml-2">200+ reviews</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs mt-2 text-gray-600">
                        <img src={assets.locationIcon} alt="location" className="w-4 h-4" />
                        <span>{room.hotel.address}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {room.amenities.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-[11px] text-blue-700"
                          >
                            <img src={facilityIcons[item]} alt={item} className="w-4 h-4" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                      <p className="text-lg font-semibold text-blue-700">
                        Rs {room.pricePerMonth}{' '}
                        <span className="text-sm font-normal text-gray-500">/ night</span>
                      </p>

                      <button
                        onClick={() => navigate(`/room/${room._id}`)}
                        className="mt-2 sm:mt-0 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 text-sm transition duration-200"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-center mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
            className="mr-4 disabled:opacity-30"
          >
            <svg width="9" height="16" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L2 9.24242L11 17" stroke="#111820" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex gap-2 text-gray-500 text-sm md:text-base">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-sm ${
                  currentPage === i + 1
                    ? 'bg-indigo-500 text-white'
                    : 'border border-gray-300/60 hover:bg-gray-300/10'
                } transition-all`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
            className="ml-4 disabled:opacity-30"
          >
            <svg width="9" height="16" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L10 9.24242L1 17" stroke="#111820" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Accommodation;
