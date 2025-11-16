import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Accommodations data from backend
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const accommodationsPerPage = 10;

  // Fetch accommodations from backend
  const fetchAccommodations = async (page = 1) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: accommodationsPerPage.toString()
      });

      // Add filters
      if (searchName) params.append('search', searchName);
      if (selectedAccommodationTypes.length > 0) {
        params.append('accommodationType', selectedAccommodationTypes.join(','));
      }
      if (searchMinPrice) params.append('min_price', searchMinPrice);
      if (searchMaxPrice) params.append('max_price', searchMaxPrice);
      if (selectedSortOption === 'Price Low to High') {
        params.append('sort_by', 'pricePerMonth');
        params.append('sort_order', 'asc');
      } else if (selectedSortOption === 'Price High to Low') {
        params.append('sort_by', 'pricePerMonth');
        params.append('sort_order', 'desc');
      }

      const response = await fetch(`http://localhost:5000/api/accommodations?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch accommodations');
      }

      const data = await response.json();
      
      if (data.success) {
        setAccommodations(data.accommodations);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
        setCurrentPage(data.currentPage);
      } else {
        throw new Error(data.message || 'Failed to fetch accommodations');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching accommodations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch accommodations on component mount and when filters change
  useEffect(() => {
    fetchAccommodations(1);
  }, [searchName, selectedAccommodationTypes, searchMinPrice, searchMaxPrice, selectedSortOption]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchAccommodations(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handlers
  const handleAccommodationTypeChange = (checked, label) => {
    setSelectedAccommodationTypes(prev =>
      checked ? [...prev, label] : prev.filter(type => type !== label)
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (checked, label) => {
    const [min, max] = label.split(' to ').map(Number);
    if (checked) {
      setSearchMinPrice(min.toString());
      setSearchMaxPrice(max.toString());
    } else {
      setSearchMinPrice('');
      setSearchMaxPrice('');
    }
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
    setSearchType('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
    setCurrentPage(1);
    fetchAccommodations(1);
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

  const handleAccommodationClick = (accommodationId) => {
    navigate(`/accommodation/${accommodationId}`);
  };

  const canResetFilters = !(
    selectedAccommodationTypes.length === 0 &&
    selectedPriceRanges.length === 0 &&
    selectedSortOption === '' &&
    !searchName &&
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
        onSearch={() => fetchAccommodations(1)}
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
          <ResultsHeader count={totalCount} loading={loading} />

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading accommodations...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <h3>Error loading accommodations</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={() => fetchAccommodations(1)}>
                Try Again
              </button>
            </div>
          ) : accommodations.length === 0 ? (
            <div className="no-results">
              <h3>No accommodations found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {accommodations.map(accommodation => (
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