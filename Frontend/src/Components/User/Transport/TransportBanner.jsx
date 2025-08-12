import React from 'react';
import './TransportBanner.css';

const TransportBanner = ({
  searchName,
  setSearchName,
  searchType,
  setSearchType,
  setSearchMinPrice,
  setSearchMaxPrice,
}) => (
  <section className="transport-hero">
    <div className="transport-hero-content container">
      <h1 className="hero-title">Find Your Perfect Ride</h1>
      <p className="hero-subtitle">
        Quality vehicles. Flexible rentals. Hassle-free campus transportation.
      </p>

      <form className="transport-search-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search by Vehicle Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="transport-search-input"
          aria-label="Vehicle name"
        />

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="transport-search-select"
          aria-label="Vehicle Type"
        >
          <option value="">Vehicle Type</option>
          <option value="Motorbike">Motorbike</option>
          <option value="Car">Car</option>
          <option value="Van">Van</option>
          <option value="Bus">Bus</option>
        </select>

        <select
          onChange={(e) => {
            const [min, max] = e.target.value.split('-');
            setSearchMinPrice(min);
            setSearchMaxPrice(max);
          }}
          className="transport-search-select"
          aria-label="Price Range"
        >
          <option value="">Price Range</option>
          <option value="0-2000">0 - 2,000</option>
          <option value="2000-4000">2,000 - 4,000</option>
          <option value="4000-6000">4,000 - 6,000</option>
        </select>

        <button type="submit" className="transport-search-btn">
          Search
        </button>
      </form>
    </div>
  </section>
);

export default TransportBanner;