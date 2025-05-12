import './PopularRooms.css'
import PopularRoomsImg from "../../Assets/Home/Popular-Rooms.png";

const rooms = [
    {
        id: 1,
        title: 'Single Room near Sabaragamuwa Uni',
        location: 'Belihuloya',
        rating: 4.6,
        price: 'Rs 5 000/=',
        image: PopularRoomsImg,
    },
    {
        id: 2,
        title: 'Single Room near Sabaragamuwa Uni',
        location: 'Belihuloya',
        rating: 4.6,
        price: 'Rs 5 000/=',
        image: PopularRoomsImg,
    },
    {
        id: 3,
        title: 'Single Room near Sabaragamuwa Uni',
        location: 'Belihuloya',
        rating: 4.6,
        price: 'Rs 5 000/=',
        image: PopularRoomsImg,
    },
];

const PopularRooms = () => {
    return (
        <div className="combined-container">
            {rooms.map((room) => (
                // rooms container
                <div key={room.id} className="card">
                    {/* Room image */}
                    <img src={room.image} alt={room.title} className="image" />
                    
                    {/* Room information section */}
                    <div className="room-info">
                        <h3>{room.title}</h3>
                        <p>Location – {room.location}</p>
                        <div className="rating"><span>⭐</span>{room.rating}</div>
                        <div className="price-action">
                            <p>{room.price}</p>
                            <button>View Details</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PopularRooms;