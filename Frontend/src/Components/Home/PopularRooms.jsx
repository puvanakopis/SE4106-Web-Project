import './PopularRooms.css';
import { roomsDummyData } from '../../Assets/assets';
import { useNavigate } from 'react-router-dom';

const PopularRooms = () => {
    const navigate = useNavigate();


    return (
        <div className="PopularRooms">
            <section className="featured-properties">
                <div className="section-header">
                    <h2>Featured Accommodations</h2>
                    <p>Top-rated stays selected by our travel experts</p>
                </div>

                <div className="properties-grid">
                    {roomsDummyData.slice(0, 3).map(room => (
                        <div
                            className="card"
                            key={room._id}
                            onClick={() => navigate(`/room/${room._id}`)}
                        >
                            <img
                                src={room.images[0]}
                                alt={`${room.roomType} in ${room.hotel.name}`}
                                className="image"
                            />
                            <div className="property-badge">{room.roomType}</div>
                            <div className="room-info">
                                <h3>{room.roomType} at {room.hotel.name}</h3>
                                <p>Location – {room.hotel.city}</p>
                                <div className="rating">
                                    <span>⭐</span> 4.5
                                </div>
                                <div className="price-action">
                                    <p>Rs {room.pricePerMonth.toLocaleString()}/= per month</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/room/${room._id}`);
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
                    onClick={() => navigate('/accommodation')}
                >
                    View All Accommodations <i className="fas fa-arrow-right"></i>
                </button>
            </section>
        </div>
    );
};

export default PopularRooms;