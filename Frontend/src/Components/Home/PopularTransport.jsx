import './PopularTransport.css';
import transport from '../../Assets/Home/transport1.png';

const transportOptions = [
  {
    id: 1,
    title: 'Tuk-Tuk for Uni Route',
    location: 'Belihuloya Campus Zone',
    rating: 4.6,
    price: 'Rs. 150 / ride',
    image: transport,
  },
  {
    id: 2,
    title: 'Tuk-Tuk for Uni Route',
    location: 'Belihuloya Campus Zone',
    rating: 4.6,
    price: 'Rs. 150 / ride',
    image: transport,
  },
  {
    id: 3,
    title: 'Tuk-Tuk for Uni Route',
    location: 'Belihuloya Campus Zone',
    rating: 4.6,
    price: 'Rs. 150 / ride',
    image: transport,
  },
  {
    id: 4,
    title: 'Tuk-Tuk for Uni Route',
    location: 'Belihuloya Campus Zone',
    rating: 4.6,
    price: 'Rs. 150 / ride',
    image: transport,
  },
];

export default function PopularTransport() {
  return (
    <section className="popular-transport-section">
      {/* Container  */}
      <div className="transport-grid">
        {transportOptions.map((option) => (
         
         
         // Transport Cards
          <div key={option.id} className="transport-card">
            {/* Image of the transport */}
            <img className="transport-image" src={option.image} alt={option.title} />
            
            {/* Information section of the card */}
            <div className="transport-info">
              <h3>{option.title}</h3>
              <p className="location">{option.location}</p>
              <div className="rating">
                <span className="star">⭐</span> {option.rating}
              </div>
              <p className="price">{option.price}</p>
              <button className="view-button">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
