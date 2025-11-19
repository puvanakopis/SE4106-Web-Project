import React from 'react';
import { FaTimes, FaFilter } from 'react-icons/fa';
import './FiltersSidebar.css';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="filter-checkbox">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
      aria-label={label}
    />
    <span className="checkmark"></span>
    <span className="filter-label">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="filter-radio">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
      aria-label={label}
    />
    <span className="radiomark"></span>
    <span className="filter-label">{label}</span>
  </label>
);

const FiltersSidebar = ({
  openFilters,
  setOpenFilters,
  types,
  priceRanges,
  sortOptions,
  selectedTypes,
  selectedPriceRanges,
  selectedSortOption,
  showAvailableOnly,
  onTypeChange,
  onPriceRangeChange,
  onSortChange,
  onAvailableChange,
  onResetFilters,
  canResetFilters,
  cardType
}) => (
  <>
    <aside
      className={`filters-sidebar ${openFilters ? 'open' : ''}`}
      aria-label="Filters"
    >
      <div className="filter-section">
        <h2 className="filter-section-title">Availability</h2>
        <div className="filter-options">
          <label className="filter-checkbox available-filter">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => onAvailableChange(e.target.checked)}
              aria-label="Show available vehicles only"
            />
            <span className="checkmark"></span>
            <span className="filter-label available-label">
              Available Now
            </span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h2 className="filter-section-title">{cardType} Types</h2>
        <div className="filter-options">
          {types.map((vehicle, i) => (
            <CheckBox
              key={`vehicle-type-${i}`}
              label={vehicle}
              selected={selectedTypes.includes(vehicle)}
              onChange={onTypeChange}
            />
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h2 className="filter-section-title">Price Range (per day)</h2>
        <div className="filter-options">
          {priceRanges.map((range, i) => (
            <CheckBox
              key={`price-range-${i}`}
              label={range}
              selected={selectedPriceRanges.includes(range)}
              onChange={onPriceRangeChange}
            />
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h2 className="filter-section-title">Sort By</h2>
        <div className="filter-options">
          {sortOptions.map((option, i) => (
            <RadioButton
              key={`sort-option-${i}`}
              label={option}
              selected={selectedSortOption === option}
              onChange={onSortChange}
            />
          ))}
        </div>
      </div>

      <button
        className="resetButton"
        onClick={onResetFilters}
        disabled={!canResetFilters}
      >
        Reset All Filters
      </button>
    </aside>

    {openFilters && (
      <div
        className="filters-overlay"
        onClick={() => setOpenFilters(false)}
      />
    )}
  </>
);

export default FiltersSidebar;