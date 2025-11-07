import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import { vehicleData } from '../../../Assets/assets';
import StarRating from '../../Rating/StarRating';
import './PopularTransport.css';

const PopularTransport = () => {
  const navigate = useNavigate();
  const [savedVehicles, setSavedVehicles] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSaveVehicle = (vehicleId, e) => {
    e.stopPropagation();
    setSavedVehicles((prev) => {
      const isSaved = prev.includes(vehicleId);
      const newSaved = isSaved
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId];
      localStorage.setItem('savedVehicles', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  return (
    <div className="PopularTransport">
      <section className="featured-transport">
        <div className="section-header">
          <h2>Featured Transport Options</h2>
          <p>Top-rated vehicles selected by our travel experts</p>
        </div>

        <div className="transport-grid">
          {vehicleData.slice(0, 3).map(vehicle => (
            <div
              className="card"
              key={vehicle.vehicle_id}
              onClick={() => {
                navigate(`/transport/${vehicle.vehicle_id}`)
              }}
            >
              <img
                src={vehicle.vehicle_images[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="image"
                loading="lazy"
              />
              <div className="transport-badge">{vehicle.vehicle_type}</div>
              <button
                className={`save-button ${savedVehicles.includes(vehicle.vehicle_id) ? 'saved' : ''}`}
                onClick={(e) => toggleSaveVehicle(vehicle.vehicle_id, e)}
                aria-label={savedVehicles.includes(vehicle.vehicle_id) ? 'Remove from saved' : 'Save this vehicle'}
              >
                {savedVehicles.includes(vehicle.vehicle_id) ? (
                  <FaHeart className="icon-heart-filled" />
                ) : (
                  <FaRegHeart className="icon-heart-outline" />
                )}
              </button>
              <div className="transport-info">
                <h3>{vehicle.brand} {vehicle.model}</h3>
                <p>Location – {vehicle.address}</p>

                <div className="rating-container">
                  <StarRating rating={vehicle.averageRating} />
                  <span className="rating-text">
                    {vehicle.averageRating.toFixed(1)} ({vehicle.totalReviews} reviews)
                  </span>
                </div>

                <div className="price-action">
                  <p>Rs {vehicle.rental_price_per_day.toLocaleString()}/= per day</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transport/${vehicle.vehicle_id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="view-all-button"
          onClick={() => {
            navigate('/transport')
          }}
        >
          View All Transport Options <FaArrowRight className="arrow-icon" />
        </button>
      </section>
    </div>
  );
};

export default PopularTransport;