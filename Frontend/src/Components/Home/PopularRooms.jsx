import './PopularRooms.css';
import { roomsDummyData } from '../../Assets/assets';
import { useNavigate } from 'react-router-dom';

const PopularRooms = () => {
    const navigate = useNavigate();
    const topRooms = [...roomsDummyData]
        .sort((a, b) => a.pricePerMonth - b.pricePerMonth)
        .slice(0, 3);

    return (
        <div className="combined-container">
            {topRooms.map((room) => (
                <div key={room._id} className="card">
                    <img
                        src={room.images[0]}
                        alt={`${room.roomType} in ${room.hotel.name}`}
                        className="image"
                    />

                    <div className="room-info">
                        <h3>{room.roomType} at {room.hotel.name}</h3>
                        <p>Location – {room.hotel.city}</p>
                        <div className="rating">
                            <span>⭐</span>
                            4.5
                        </div>
                        <div className="price-action">
                            <p>Rs {room.pricePerMonth.toLocaleString()}/= per month</p>
                            <button
                                onClick={() => {
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
    );
};

export default PopularRooms;