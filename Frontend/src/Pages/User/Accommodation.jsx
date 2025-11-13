import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { accommodationsData } from '../../Assets/assets';
import { FaTimes, FaFilter } from 'react-icons/fa';
import './Accommodation.css';

import AccommodationBanner from '../../Components/User/Accommodation/AccommodationBanner';
import FiltersSidebar from '../../Components/User/Accommodation/FiltersSidebar';
import ResultsHeader from '../../Components/User/Accommodation/ResultsHeader';
import AccommodationCard from '../../Components/User/Accommodation/AccommodationCard';
import Pagination from '../../Components/User/Accommodation/Pagination';

const Accommodation = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [savedAccommodations, setSavedAccommodations] = useState(() => {
    const saved = localStorage.getItem('savedAccommodations');
    return saved ? JSON.parse(saved) : [];
  });

  // Search and filter states
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // Filter options
  const accommodationTypes = ['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'];
  const priceRanges = ['0 to 2500', '2500 to 5000', '5000 to 10000', '10000 to 15000'];
  const sortOptions = ['Price Low to High', 'Price High to Low'];

  const [selectedAccommodationTypes, setSelectedAccommodationTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const accommodationsPerPage = 5;

  // Filter and sort accommodations
  const filteredAccommodations = useMemo(() => {
    let result = [...accommodationsData];
    
    if (searchName.trim()) {
      result = result.filter(accommodation => 
        accommodation.hotel.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    
    if (searchCity.trim()) {
      result = result.filter(accommodation => 
        accommodation.hotel.city.toLowerCase().includes(searchCity.toLowerCase())
      );
    }
    
    if (searchType.trim()) {
      result = result.filter(accommodation => 
        accommodation.accommodationType.toLowerCase().includes(searchType.toLowerCase())
      );
    }
    
    if (searchMinPrice) {
      result = result.filter(accommodation => 
        accommodation.pricePerMonth >= Number(searchMinPrice)
      );
    }
    
    if (searchMaxPrice) {
      result = result.filter(accommodation => 
        accommodation.pricePerMonth <= Number(searchMaxPrice)
      );
    }
    
    if (selectedAccommodationTypes.length > 0) {
      result = result.filter(accommodation => 
        selectedAccommodationTypes.includes(accommodation.accommodationType)
      );
    }
    
    if (selectedPriceRanges.length > 0) {
      result = result.filter(accommodation => 
        selectedPriceRanges.some(range => {
          const [min, max] = range.replace('Rs ', '').split(' to ').map(Number);
          return accommodation.pricePerMonth >= min && accommodation.pricePerMonth <= max;
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
    accommodationsData,
    searchName,
    searchCity,
    searchType,
    searchMinPrice,
    searchMaxPrice,
    selectedAccommodationTypes,
    selectedPriceRanges,
    selectedSortOption
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAccommodations.length / accommodationsPerPage);
  const paginatedAccommodations = useMemo(() => {
    const startIdx = (currentPage - 1) * accommodationsPerPage;
    return filteredAccommodations.slice(startIdx, startIdx + accommodationsPerPage);
  }, [filteredAccommodations, currentPage, accommodationsPerPage]);

  // Handlers
  const handleAccommodationTypeChange = (checked, label) => {
    setSelectedAccommodationTypes(prev =>
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
    setSelectedAccommodationTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setSearchName('');
    setSearchCity('');
    setSearchType('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
    setCurrentPage(1);
  };

  const toggleSaveAccommodation = (accommodationId, e) => {
    e.stopPropagation();
    setSavedAccommodations(prev => {
      const isSaved = prev.includes(accommodationId);
      const newSaved = isSaved
        ? prev.filter(id => id !== accommodationId)
        : [...prev, accommodationId];
      localStorage.setItem('savedAccommodations', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAccommodationClick = (accommodationId) => {
    navigate(`/accommodation/${accommodationId}`);
  };

  const canResetFilters = !(
    selectedAccommodationTypes.length === 0 &&
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
          accommodationTypes={accommodationTypes}
          priceRanges={priceRanges}
          sortOptions={sortOptions}
          selectedAccommodationTypes={selectedAccommodationTypes}
          selectedPriceRanges={selectedPriceRanges}
          selectedSortOption={selectedSortOption}
          onAccommodationTypeChange={handleAccommodationTypeChange}
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

        <main className="accommodations-list">
          <ResultsHeader count={filteredAccommodations.length} />

          {paginatedAccommodations.length === 0 ? (
            <div className="no-results">
              <h3>No accommodations found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {paginatedAccommodations.map(accommodation => (
                <AccommodationCard
                  key={accommodation._id}
                  accommodation={accommodation}
                  saved={savedAccommodations.includes(accommodation._id)}
                  onSave={toggleSaveAccommodation}
                  onClick={() => handleAccommodationClick(accommodation._id)}
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