import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaFilter } from 'react-icons/fa';
import FiltersSidebar from '../../Components/User/FiltersSidebar';
import Pagination from '../../Components/Pagination';
import ItemCard from '../../Components/User/ItemCard';
import './Transport.css';
import Loading from '../Loading';

const Transport = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  // Filter states
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Search states
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // Transport data
  const [transports, setTransports] = useState([]);
  const [filteredTransports, setFilteredTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transportsPerPage = 9;

  // Filter options
  const vehicleTypes = [
    'Motorbike',
    'Car',
    'Scooter',
    'Bicycle',
    'Van',
    'Bus',
    'Other'
  ];

  const priceRanges = [
    { label: '0 to 2500', min: 0, max: 2500 },
    { label: '2500 to 5000', min: 2500, max: 5000 },
    { label: '5000 to 10000', min: 5000, max: 10000 },
    { label: '10000 to 15000', min: 10000, max: 15000 }
  ];

  const sortOptions = ['Price Low to High', 'Price High to Low', 'Seating Capacity'];

  // Check if filters can be reset
  const canResetFilters = !(
    selectedVehicleTypes.length === 0 &&
    selectedPriceRanges.length === 0 &&
    selectedSortOption === '' &&
    !showAvailableOnly &&
    !searchName &&
    !searchType &&
    !searchMinPrice &&
    !searchMaxPrice
  );

  // ----------- Get all transports -----------
  const fetchTransports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/transports');
      if (!response.ok) throw new Error('Failed to fetch transports');

      const data = await response.json();

      if (data.success) {
        setTransports(data.transports || []);
      } else {
        throw new Error(data.message || 'Failed to fetch transports');
      }
    } catch (err) {
      console.error('Error fetching transports:', err);
      setError(err.message);
      setTransports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  // ----------- Apply filters & sorting (same as Accommodation) -----------
  const applyFiltersAndSorting = () => {
    let filtered = [...transports];

    // Show available only
    if (showAvailableOnly) {
      filtered = filtered.filter(vehicle =>
        vehicle.available === 'Available' && vehicle.status === 'Active'
      );
    }

    // Search by name/brand/model/location
    if (searchName.trim()) {
      filtered = filtered.filter(vehicle =>
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchName.toLowerCase()) ||
        vehicle.location?.toLowerCase().includes(searchName.toLowerCase()) ||
        vehicle.address?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Search by type
    if (searchType.trim()) {
      filtered = filtered.filter(vehicle =>
        vehicle.vehicle_type?.toLowerCase().includes(searchType.toLowerCase())
      );
    }

    // Min price
    if (searchMinPrice) {
      filtered = filtered.filter(vehicle =>
        (vehicle.rental_price_per_day || 0) >= Number(searchMinPrice)
      );
    }

    // Max price
    if (searchMaxPrice) {
      filtered = filtered.filter(vehicle =>
        (vehicle.rental_price_per_day || 0) <= Number(searchMaxPrice)
      );
    }

    // Vehicle types filter
    if (selectedVehicleTypes.length > 0) {
      filtered = filtered.filter(vehicle =>
        selectedVehicleTypes.includes(vehicle.vehicle_type)
      );
    }

    // Price range filter (same style as Accommodation)
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(vehicle =>
        selectedPriceRanges.some(range => {
          const price = vehicle.rental_price_per_day || 0;
          return price >= range.min && price <= range.max;
        })
      );
    }

    // Sort
    if (selectedSortOption) {
      filtered.sort((a, b) => {
        const priceA = a.rental_price_per_day || 0;
        const priceB = b.rental_price_per_day || 0;

        if (selectedSortOption === 'Price Low to High') return priceA - priceB;
        if (selectedSortOption === 'Price High to Low') return priceB - priceA;
        if (selectedSortOption === 'Seating Capacity') {
          return (b.seating_capacity || 0) - (a.seating_capacity || 0);
        }
        return 0;
      });
    }

    setFilteredTransports(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (transports.length > 0) {
      applyFiltersAndSorting();
    }
  }, [
    transports,
    selectedVehicleTypes,
    selectedPriceRanges,
    selectedSortOption,
    showAvailableOnly,
    searchName,
    searchType,
    searchMinPrice,
    searchMaxPrice
  ]);

  // ----------- Get current transports per page -----------
  const getCurrentTransports = () => {
    const startIndex = (currentPage - 1) * transportsPerPage;
    const endIndex = startIndex + transportsPerPage;
    return filteredTransports.slice(startIndex, endIndex);
  };

  const currentTransports = getCurrentTransports();
  const totalPages = Math.ceil(filteredTransports.length / transportsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ----------- Filter handlers -----------
  const handleVehicleTypeChange = (checked, type) => {
    setSelectedVehicleTypes(prev =>
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
    setSelectedVehicleTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setShowAvailableOnly(false);
    setSearchName('');
    setSearchType('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
  };

  if (loading) {
    return <Loading text='Loading your vehicles...' />
  }

  return (
    <div className="transport">

      <div className="transport-header">
        <button
          className="mobile-filter-toggle"
          onClick={() => setOpenFilters(!openFilters)}
          aria-expanded={openFilters}
        >
          {openFilters ? <><FaTimes /> Hide Filters</> : <><FaFilter /> Show Filters</>}
        </button>
      </div>

      <div className="transport-content">

        <FiltersSidebar
          open={openFilters}
          types={vehicleTypes}
          priceRanges={priceRanges}
          sortOptions={sortOptions}
          selectedTypes={selectedVehicleTypes}
          selectedPriceRanges={selectedPriceRanges}
          selectedSortOption={selectedSortOption}
          onTypeChange={handleVehicleTypeChange}
          onPriceRangeChange={handlePriceRangeChange}
          onSortChange={handleSortChange}
          onResetFilters={resetAllFilters}
          cardType="Transport"
          canResetFilters={canResetFilters}
          onAvailableChange={handleAvailableChange}
          setOpenFilters={setOpenFilters}
          showAvailableOnly={showAvailableOnly}
        />

        {openFilters && <div className="filters-overlay" onClick={() => setOpenFilters(false)} />}

        <main className="transports-list">
          {currentTransports.length === 0 ? (
            <div className="no-results">
              <h3>No vehicles found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-filters" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {currentTransports.map(vehicle => (
                <ItemCard
                  key={vehicle._id}
                  item={vehicle}
                  onClick={() => navigate(`/transport/${vehicle._id}`)}
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

export default Transport;