import './PopularTransport.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import {  vehicleData } from '../../Assets/assets';

const PopularTransport = () => {
  const navigate = useNavigate();

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
              />
              <div className="transport-badge">{option.type}</div>
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