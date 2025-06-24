import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';
import './Saved.css';

const savedAccommodations = [
  {
    _id: 'room_1',
    images: [assets.roomImg1],
    roomType: 'Double Bed',
    title: 'Luxury Suites Double Room',
    hotel: {
      name: 'Luxury Suites',
      city: 'Colombo',
      address: '123 Beach Road'
    },
    rating: 4.5,
    amenities: ['Wifi', 'AC', 'TV', 'Parking'],
    pricePerMonth: 12000,
    distance_to_university: 2.5,
    review_count: 124
  },
  {
    _id: 'room_2',
    images: [assets.roomImg1],
    roomType: 'Single Bed',
    title: 'City View Single Room',
    hotel: {
      name: 'City View Hotel',
      city: 'Kandy',
      address: '45 Hill Street'
    },
    rating: 4.2,
    amenities: ['Wifi', 'AC', 'Breakfast'],
    pricePerMonth: 8000,
    distance_to_university: 1.8,
    review_count: 87
  }
];

const savedTransports = [
  {
    vehicle_id: 'vehicle_1',
    images: [assets.roomImg1],
    vehicle_type: 'Car',
    brand: 'Toyota',
    model: 'Corolla',
    average_rating: 4.7,
    fuel_type: 'Petrol',
    seating_capacity: 5,
    rental_price_per_day: 4500,
    review_count: 56
  },
  {
    vehicle_id: 'vehicle_2',
    images: [assets.roomImg1],
    vehicle_type: 'Motorbike',
    brand: 'Honda',
    model: 'CBR 250',
    average_rating: 4.3,
    fuel_type: 'Petrol',
    seating_capacity: 2,
    rental_price_per_day: 1500,
    review_count: 42
  }
];

const Saved = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('accommodation');

  return (
    <div className="saved-profile">
      <div className="saved-header">
        {/* Page heading */}
        <div>Your Saved Items</div>
      </div>

      <div className="saved-container">

        {/* -------------- Sidebar --------------  */}
        <div className="saved-sidebar">
          <div
            onClick={() => setActiveTab('accommodation')}
            className={`saved-title ${activeTab === 'accommodation' ? 'active' : ''}`}
          >
            Accommodations
          </div>
          <div
            onClick={() => setActiveTab('transport')}
            className={`saved-title ${activeTab === 'transport' ? 'active' : ''}`}
          >
            Transport
          </div>
        </div>

        {/* -------------- Main Content -------------- */}
        <div className="saved-content">
          {activeTab === 'accommodation' ? (
            <>
              {/* no accommodation saved */}
              {savedAccommodations.length === 0 ? (
                <div className="no-saved">
                  <img src={assets.emptyFavorites} alt="No saved accommodations" />
                  <h3>No saved accommodations yet</h3>
                  <p>Save your favorite rooms by clicking the heart icon</p>
                  <button
                    className="browse-button"
                    onClick={() => navigate('/accommodation')}
                  >
                    Browse Accommodations
                  </button>
                </div>
              ) : (
                /* saved accommodation cards */
                <div className="saved-grid">
                  {savedAccommodations.map((accommodation) => (
                    <div
                      key={accommodation._id}
                      className="card"
                      onClick={() => navigate(`/room/${accommodation._id}`)}
                    >
                      <img
                        src={accommodation.images[0]}
                        alt={`${accommodation.roomType} in ${accommodation.hotel.name}`}
                        className="image"
                      />
                      <div className="property-badge">{accommodation.roomType}</div>
                      <div className="room-info">
                        <h3>{accommodation.roomType} at {accommodation.hotel.name}</h3>
                        <p>Location – {accommodation.hotel.city}</p>
                        <div className="rating">
                          <StarRating rating={accommodation.rating} />
                          <span>{accommodation.review_count} reviews</span>
                        </div>
                        <div className="price-action">
                          <p>Rs {accommodation.pricePerMonth.toLocaleString()}/= per month</p>
                          <button
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation(); 
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/*no transport saved */}
              {savedTransports.length === 0 ? (
                <div className="no-saved">
                  <img src={assets.emptyFavorites} alt="No saved vehicles" />
                  <h3>No saved vehicles yet</h3>
                  <p>Save your favorite vehicles by clicking the heart icon</p>
                  <button
                    className="browse-button"
                    onClick={() => navigate('/transport')}
                  >
                    Browse Transport
                  </button>
                </div>
              ) : (
                /*  saved transport cards */
                <div className="saved-grid">
                  {savedTransports.map((vehicle) => (
                    <div
                      key={vehicle.vehicle_id}
                      className="card"
                      onClick={() => navigate(`/transport/${vehicle.vehicle_id}`)}
                    >
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="image"
                      />
                      <div className="property-badge">{vehicle.vehicle_type}</div>
                      <div className="room-info">
                        <h3>{vehicle.brand} {vehicle.model}</h3>
                        <div className="specs">
                          <p>Fuel – {vehicle.fuel_type}</p>
                          <p>Seats – {vehicle.seating_capacity}</p>
                        </div>
                        <div className="rating">
                          <StarRating rating={vehicle.average_rating} />
                          <span>{vehicle.review_count} reviews</span>
                        </div>
                        <div className="price-action">
                          <p>Rs {vehicle.rental_price_per_day.toLocaleString()}/= per day</p>
                          <button
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation(); 
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;
