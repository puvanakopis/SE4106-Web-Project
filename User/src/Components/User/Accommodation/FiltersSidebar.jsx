import './FiltersSidebar.css'

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
}) => (
  <aside className={`filters-sidebar ${open ? 'open' : ''}`}>
    
    {/* ---------------- Room Types Section ----------------*/}
    <div className="filter-section">
      <h2 className="filter-section-title">Room Types</h2>
      <div className="filter-options">
        {roomTypes.map((room, i) => (
          <label key={`room-type-${i}`} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedRoomTypes.includes(room)}
              onChange={(e) => onRoomTypeChange(e.target.checked, room)}
              aria-label={room}
            />
            <span className="checkmark"></span>
            <span className="filter-label">{room}</span>
          </label>
        ))}
      </div>
    </div>

    {/* ---------------- Price Range Section ---------------- */}
    <div className="filter-section">
      <h2 className="filter-section-title">Price Range</h2>
      <div className="filter-options">
        {priceRanges.map((range, i) => (
          <label key={`price-range-${i}`} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedPriceRanges.includes(`Rs ${range}`)}
              onChange={(e) => onPriceRangeChange(e.target.checked, range)}
              aria-label={range}
            />
            <span className="checkmark"></span>
            <span className="filter-label">{range}</span>
          </label>
        ))}
      </div>
    </div>

    {/* ---------------- Sort Options Section ---------------- */}
    <div className="filter-section">
      <h2 className="filter-section-title">Sort By</h2>
      <div className="filter-options">
        {sortOptions.map((option, i) => (
          <label key={`sort-option-${i}`} className="filter-radio">
            <input
              type="radio"
              name="sortOption"
              checked={selectedSortOption === option}
              onChange={() => onSortChange(option)}
              aria-label={option}
            />
            <span className="radiomark"></span>
            <span className="filter-label">{option}</span>
          </label>
        ))}
      </div>
    </div>

    {/* ---------------- Reset Button ---------------- */}
    <button
      className="resetButton"
      onClick={onResetFilters}
    >
      Reset All Filters
    </button>
  </aside>
);

export default FiltersSidebar;