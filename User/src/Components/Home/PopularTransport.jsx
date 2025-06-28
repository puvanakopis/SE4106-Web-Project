import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaStar, FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import { vehicleData } from '../../Assets/assets';
import './PopularTransport.css';

const PopularTransport = () => {
  const navigate = useNavigate();
  const [savedVehicles, setSavedVehicles] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const toggleSaveVehicle = (vehicleId, e) => {
    e.stopPropagation();
    setSavedVehicles((prev) => {
      const isSaved = prev.includes(vehicleId);
      const newSaved = isSaved
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId];
      localStorage.setItem('savedVehicles', JSON.stringify(newSaved));
      
      if (!isSaved) {
        setShowSavedNotification(true);
      }
      
      return newSaved;
    });
  };

  useEffect(() => {
    if (showSavedNotification) {
      const timer = setTimeout(() => {
        setShowSavedNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSavedNotification]);

  // Get 4 vehicles
  const transportOptions = vehicleData.slice(0, 4).map(vehicle => ({
    id: vehicle.vehicle_id,
    title: `${vehicle.brand} ${vehicle.model}`,
    location: vehicle.address,
    rating: vehicle.average_rating,
    price: `Rs. ${vehicle.rental_price_per_day} / day`,
    image: vehicle.vehicle_images[0],
    type: vehicle.vehicle_type,
    vehicleData: vehicle
  }));

  return (
    <div className="PopularTransport">
      {/* Save Notification */}
      {showSavedNotification && (
        <div className="save-notification">
          <div className="notification-content">
            <FaHeart className="notification-icon" />
            <span>Vehicle saved</span>
          </div>
          <button 
            className="notification-close" 
            onClick={() => setShowSavedNotification(false)}
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <section className="featured-transport">
        <div className="section-header">
          <h2>Transportation Options</h2>
          <p>Convenient ways to reach your destination</p>
        </div>

        <div className="transport-grid">
          {transportOptions.map(option => (
            <div
              className="card"
              key={option.id}
              onClick={() => navigate(`/transport/${option.id}`, { state: { vehicle: option.vehicleData } })}
            >
              <img
                src={option.image}
                alt={option.title}
                className="image"
                loading="lazy"
              />
              <div className="transport-badge">{option.type}</div>
              {/* Save Button */}
              <button 
                className={`save-button ${savedVehicles.includes(option.id) ? 'saved' : ''}`}
                onClick={(e) => toggleSaveVehicle(option.id, e)}
                aria-label={savedVehicles.includes(option.id) ? 'Remove from saved' : 'Save this vehicle'}
              >
                {savedVehicles.includes(option.id) ? (
                  <FaHeart className="icon-heart-filled" />
                ) : (
                  <FaRegHeart className="icon-heart-outline" />
                )}
              </button>
              <div className="transport-info">
                <h3>{option.title}</h3>
                <p>Location – {option.location}</p>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`star ${i < Math.floor(option.rating) ? 'filled' : ''} ${i === Math.floor(option.rating) && option.rating % 1 >= 0.5 ? 'half-filled' : ''}`}
                    />
                  ))}
                  <span> {option.rating.toFixed(1)}</span>
                </div>
                <div className="price-action">
                  <p>{option.price}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transport/${option.id}`, { state: { vehicle: option.vehicleData } });
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
          onClick={() => navigate('/transport')}
        >
          View All Transport Options <FaArrowRight className="arrow-icon" />
        </button>
      </section>
    </div>
  );
};

export default PopularTransport;