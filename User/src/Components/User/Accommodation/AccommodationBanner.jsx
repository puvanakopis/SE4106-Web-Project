import './AccommodationBanner.css'

const AccommodationBanner = ({
  searchName,
  setSearchName,
  searchType,
  setSearchType,
  setSearchMinPrice,
  setSearchMaxPrice,
}) => (
  <>{/* ------------- Hero Section ------------- */}
    <section className="accommodation-hero">
      <div className="accommodation-hero-content container">
        <h1 className="hero-title">Find the Ideal Room for You</h1>
        <p className="hero-subtitle">
          Smart filters. Trusted listings. Simplified campus life.
        </p>

        <>{/* ------------- Search Form ------------- */}
          <form className="accommodation-search-bar" onSubmit={(e) => e.preventDefault()}>

            {/* Search by Accommodation Name */}
            <input
              type="text"
              placeholder="Search by Accommodation Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="accommodation-search-input"
              aria-label="Hotel name"
            />


            {/* Room Type */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="accommodation-search-select"
              aria-label="Room Type"
            >
              <option value="">Room Type</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Triple Sharing">Triple Sharing</option>
              <option value="Annexe">Annexe</option>
            </select>


            {/* Price Range */}
            <select
              onChange={(e) => {
                const [min, max] = e.target.value.split('-');
                setSearchMinPrice(min);
                setSearchMaxPrice(max);
              }}
              className="accommodation-search-select"
              aria-label="Price Range"
            >
              <option value="">Price Range</option>
              <option value="0-2500">0 - 2,500</option>
              <option value="2500-5000">2,500 - 5,000</option>
              <option value="5000-10000">5,000 - 10,000</option>
              <option value="10000-15000">10,000 - 15,000</option>
            </select>

            <button type="submit" className="btn accommodation-search-btn">
              Search
            </button>
          </form>
        </>
      </div>
    </section>
  </>
);

export default AccommodationBanner;