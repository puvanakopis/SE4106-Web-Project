import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaFilter } from 'react-icons/fa';
import FiltersSidebar from '../../Components/User/FiltersSidebar';
import Pagination from '../../Components/Pagination';
import ItemCard from '../../Components/User/ItemCard';
import './Accommodation.css';

const Accommodation = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  // Filter states
  const [selectedAccommodationTypes, setSelectedAccommodationTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Search states
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // Accommodations data
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const accommodationsPerPage = 9;

  // Filter options
  const accommodationTypes = ['Single Bed', 'Double Bed', 'Triple Sharing', 'Annexe'];
  const priceRanges = [
    { label: '0 to 2500', min: 0, max: 2500 },
    { label: '2500 to 5000', min: 2500, max: 5000 },
    { label: '5000 to 10000', min: 5000, max: 10000 },
    { label: '10000 to 15000', min: 10000, max: 15000 }
  ];
  const sortOptions = ['Price Low to High', 'Price High to Low'];

  // Check if filters can be reset
  const canResetFilters = !(
    selectedAccommodationTypes.length === 0 &&
    selectedPriceRanges.length === 0 &&
    selectedSortOption === '' &&
    !showAvailableOnly &&
    !searchName &&
    !searchType &&
    !searchMinPrice &&
    !searchMaxPrice
  );

  // ----------- Get all accommodations -----------
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/accommodations');
      if (!response.ok) throw new Error('Failed to fetch accommodations');

      const data = await response.json();

      if (data.success) {
        setAccommodations(data.accommodations || []);
      } else {
        throw new Error(data.message || 'Failed to fetch accommodations');
      }
    } catch (err) {
      console.error('Error fetching accommodations:', err);
      setError(err.message);
      setAccommodations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  // ----------- Apply filters -----------
  const applyFiltersAndSorting = () => {
    let filtered = [...accommodations];

    // Show available only filter
    if (showAvailableOnly) {
      filtered = filtered.filter(accommodation =>
        accommodation.available === 'Available' && accommodation.status === 'Active'
      );
    }

    // Search by name/location
    if (searchName.trim()) {
      filtered = filtered.filter(accommodation =>
        `${accommodation.title} ${accommodation.location}`.toLowerCase().includes(searchName.toLowerCase()) ||
        accommodation.address?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Search by type
    if (searchType.trim()) {
      filtered = filtered.filter(accommodation =>
        accommodation.type?.toLowerCase().includes(searchType.toLowerCase())
      );
    }

    // Search by min price
    if (searchMinPrice) {
      filtered = filtered.filter(accommodation =>
        (accommodation.pricePerMonth || 0) >= Number(searchMinPrice)
      );
    }

    // Search by max price
    if (searchMaxPrice) {
      filtered = filtered.filter(accommodation =>
        (accommodation.pricePerMonth || 0) <= Number(searchMaxPrice)
      );
    }

    // Accommodation types filter
    if (selectedAccommodationTypes.length > 0) {
      filtered = filtered.filter(accommodation =>
        selectedAccommodationTypes.includes(accommodation.type)
      );
    }

    // Price ranges filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(accommodation => {
        return selectedPriceRanges.some(range => {
          const price = accommodation.pricePerMonth || 0;
          return price >= range.min && price <= range.max;
        });
      });
    }

    // Sort options
    if (selectedSortOption) {
      filtered.sort((a, b) => {
        const priceA = a.pricePerMonth || 0;
        const priceB = b.pricePerMonth || 0;

        if (selectedSortOption === 'Price Low to High') {
          return priceA - priceB;
        } else if (selectedSortOption === 'Price High to Low') {
          return priceB - priceA;
        }
        return 0;
      });
    }

    setFilteredAccommodations(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  useEffect(() => {
    if (accommodations.length > 0) {
      applyFiltersAndSorting();
    }
  }, [
    accommodations,
    selectedAccommodationTypes,
    selectedPriceRanges,
    selectedSortOption,
    showAvailableOnly,
    searchName,
    searchType,
    searchMinPrice,
    searchMaxPrice
  ]);

  // ----------- Get current accommodations per page -----------
  const getCurrentAccommodations = () => {
    const startIndex = (currentPage - 1) * accommodationsPerPage;
    const endIndex = startIndex + accommodationsPerPage;
    return filteredAccommodations.slice(startIndex, endIndex);
  };

  // ----------- Pagination handler -----------
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ----------- Filter handlers -----------
  const handleAccommodationTypeChange = (checked, type) => {
    setSelectedAccommodationTypes(prev =>
      checked ? [...prev, type] : prev.filter(t => t !== type)
    );
  };

  const handlePriceRangeChange = (checked, range) => {
    setSelectedPriceRanges(prev =>
      checked ? [...prev, range] : prev.filter(r => r.label !== range.label)
    );
  };

  const handleSortChange = (option) => {
    setSelectedSortOption(prev => prev === option ? '' : option);
  };

  const handleAvailableChange = (checked) => {
    setShowAvailableOnly(checked);
  };

  const resetAllFilters = () => {
    setSelectedAccommodationTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setShowAvailableOnly(false);
    setSearchName('');
    setSearchType('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
  };

  const currentAccommodations = getCurrentAccommodations();
  const totalPages = Math.ceil(filteredAccommodations.length / accommodationsPerPage);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your accommodations...</p>
        </div>
      </div>
    );
  }

  if (error && accommodations.length === 0) {
    return (
      <div className="accommodation-error">
        <h3>Error loading accommodations</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="accommodation">
      <div className="accommodation-header">
        <button
          className="mobile-filter-toggle"
          onClick={() => setOpenFilters(!openFilters)}
          aria-expanded={openFilters}
        >
          {openFilters ? <><FaTimes /> Hide Filters</> : <><FaFilter /> Show Filters</>}
        </button>
      </div>

      <div className="accommodation-content">
        <FiltersSidebar
          open={openFilters}
          types={accommodationTypes}
          priceRanges={priceRanges}
          sortOptions={sortOptions}
          selectedTypes={selectedAccommodationTypes}
          selectedPriceRanges={selectedPriceRanges}
          selectedSortOption={selectedSortOption}
          onTypeChange={handleAccommodationTypeChange}
          onPriceRangeChange={handlePriceRangeChange}
          onSortChange={handleSortChange}
          onResetFilters={resetAllFilters}
          cardType="Accommodation"
          canResetFilters={canResetFilters}
          onAvailableChange={handleAvailableChange}
          setOpenFilters={setOpenFilters}
          showAvailableOnly={showAvailableOnly}
        />

        {openFilters && <div className="filters-overlay" onClick={() => setOpenFilters(false)} />}

        <main className="accommodations-list">
          {currentAccommodations.length === 0 ? (
            <div className="no-results">
              <h3>No accommodations found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {currentAccommodations.map(item => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onClick={() => navigate(`/accommodation/${item._id}`)}
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