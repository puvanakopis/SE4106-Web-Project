import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import TransportBanner from '../../Components/User/Transport/TransportBanner';
import FiltersSidebar from '../../Components/User/Transport/FiltersSidebar';
import ResultsHeader from '../../Components/User/Transport/ResultsHeader';
import Pagination from '../../Components/User/Transport/Pagination';
import TransportCard from '../../Components/User/Transport/TransportCards';
import { vehicleData } from '../../Assets/assets';
import './Transport.css';

const Transport = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);

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
    navigate(`/vehicle/${vehicleId}`);
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
        <FiltersSidebar
          openFilters={openFilters}
          setOpenFilters={setOpenFilters}
          vehicleTypes={vehicleTypes}
          priceRanges={priceRanges}
          sortOptions={sortOptions}
          selectedVehicleTypes={selectedVehicleTypes}
          selectedPriceRanges={selectedPriceRanges}
          selectedSortOption={selectedSortOption}
          handleVehicleTypeChange={handleVehicleTypeChange}
          handlePriceRangeChange={handlePriceRangeChange}
          handleSortChange={handleSortChange}
          resetAllFilters={resetAllFilters}
          canResetFilters={canResetFilters}
        />

        <main className="transports-main">
          <ResultsHeader count={filteredTransports.length} />
          
          {filteredTransports.length === 0 ? (
            <div className="no-results">
              <h3>No vehicles found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="transports-grid">
                {paginatedTransports.map(vehicle => (
                  <TransportCard
                    key={vehicle.vehicle_id}
                    vehicle={vehicle}
                    saved={savedVehicles.includes(vehicle.vehicle_id)}
                    onSave={toggleSaveVehicle}
                    onClick={() => handleVehicleClick(vehicle.vehicle_id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Transport;