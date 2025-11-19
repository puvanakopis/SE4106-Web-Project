import './FiltersSidebar.css';

const FiltersSidebar = ({
  open,
  types,
  priceRanges,
  sortOptions,
  selectedTypes,
  selectedPriceRanges,
  selectedSortOption,
  onTypeChange,
  onPriceRangeChange,
  onSortChange,
  onResetFilters,
  cardType,
  canResetFilters,
  onAvailableChange,
  showAvailableOnly
}) => (
  <aside className={`filters-sidebar ${open ? 'open' : ''}`}>

    {/* Available Only Filter */}
    <div className="filter-section">
      <h3 className="filter-section-title">Availability</h3>
      <div className="filter-options">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={e => onAvailableChange(e.target.checked)}
          />
          <span className="checkmark"></span>
          <span className="filter-label">Show Available Only</span>
        </label>
      </div>
    </div>

    {/* Accommodation Types */}
    <div className="filter-section">
      <h3 className="filter-section-title">{cardType} Types</h3>
      <div className="filter-options">
        {types.map((type, i) => (
          <label key={i} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={e => onTypeChange(e.target.checked, type)}
            />
            <span className="checkmark"></span>
            <span className="filter-label">{type}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Ranges */}
    <div className="filter-section">
      <h3 className="filter-section-title">Price Range (per month)</h3>
      <div className="filter-options">
        {priceRanges.map((range, i) => (
          <label key={i} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedPriceRanges.some(r => r.label === range.label)}
              onChange={e => onPriceRangeChange(e.target.checked, range)}
            />
            <span className="checkmark"></span>
            <span className="filter-label">₹{range.label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Sort Options */}
    <div className="filter-section">
      <h3 className="filter-section-title">Sort By</h3>
      <div className="filter-options">
        {sortOptions.map((option, i) => (
          <label key={i} className="filter-radio">
            <input
              type="radio"
              name="sortOption"
              checked={selectedSortOption === option}
              onChange={() => onSortChange(option)}
            />
            <span className="radiomark"></span>
            <span className="filter-label">{option}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Reset Filters Button */}
    <button 
      className={`resetButton ${!canResetFilters ? 'resetButton--disabled' : ''}`} 
      onClick={onResetFilters}
      disabled={!canResetFilters}
    >
      Reset All
    </button>
  </aside>
);

export default FiltersSidebar;