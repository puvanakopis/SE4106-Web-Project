import './OwnerProperties.css';

const OwnerProperties = ({ owner, onClose, onEdit, onDelete, onBlockToggle }) => {
  const ownedRooms = [
    {
      _id: "room_1",
      hotel: { name: "Landa Villa" },
      roomType: "Single Bed",
      pricePerMonth: 3500,
      amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
      isAvailable: true
    },
    {
      _id: "room_2",
      hotel: { name: "Ocean View" },
      roomType: "Double Bed",
      pricePerMonth: 5000,
      amenities: ["Wi-Fi", "AC", "Private Bathroom"],
      isAvailable: false
    }
  ];

  const ownedTransports = [
    {
      vehicle_id: "vehicle_1",
      vehicle_type: "Motorbike",
      brand: "Honda",
      model: "CBR 500R",
      rental_price_per_day: 1500,
      availability_status: true,
      average_rating: 4.5
    },
    {
      vehicle_id: "vehicle_2",
      vehicle_type: "Car",
      brand: "Toyota",
      model: "Corolla",
      rental_price_per_day: 2500,
      availability_status: false,
      average_rating: 4.2
    }
  ];

  return (
    <div className="owner-properties">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{owner.fullName}'s Properties</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="properties-section">
          <div className="section-header">
            <h3>Owned Rooms ({ownedRooms.length})</h3>
            <button className="add-button">+ Add Room</button>
          </div>
          {ownedRooms.length > 0 ? (
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Hotel</th>
                  <th>Price/Month</th>
                  <th>Amenities</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ownedRooms.map(room => (
                  <tr key={room._id}>
                    <td>{room.roomType}</td>
                    <td>{room.hotel.name}</td>
                    <td>Rs. {room.pricePerMonth.toLocaleString()}</td>
                    <td>
                      <div className="amenities-container">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${room.isAvailable ? 'available' : 'occupied'}`}>
                        {room.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-button edit" onClick={() => onEdit(room)}>
                        Edit
                      </button>
                      <button className="action-button delete" onClick={() => onDelete(room._id, 'room')}>
                        Delete
                      </button>
                      <button 
                        className={`action-button ${room.isAvailable ? 'block' : 'unblock'}`}
                        onClick={() => onBlockToggle(room._id, 'room', !room.isAvailable)}
                      >
                        {room.isAvailable ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-properties">No rooms owned by this user</p>
          )}
        </div>

        <div className="properties-section">
          <div className="section-header">
            <h3>Owned Transports ({ownedTransports.length})</h3>
            <button className="add-button">+ Add Transport</button>
          </div>
          {ownedTransports.length > 0 ? (
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Brand/Model</th>
                  <th>Price/Day</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ownedTransports.map(transport => (
                  <tr key={transport.vehicle_id}>
                    <td>{transport.vehicle_type}</td>
                    <td>{transport.brand} {transport.model}</td>
                    <td>Rs. {transport.rental_price_per_day.toLocaleString()}</td>
                    <td>
                      <div className="rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-value">{transport.average_rating}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${transport.availability_status ? 'available' : 'occupied'}`}>
                        {transport.availability_status ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-button edit" onClick={() => onEdit(transport)}>
                        Edit
                      </button>
                      <button className="action-button delete" onClick={() => onDelete(transport.vehicle_id, 'transport')}>
                        Delete
                      </button>
                      <button 
                        className={`action-button ${transport.availability_status ? 'block' : 'unblock'}`}
                        onClick={() => onBlockToggle(transport.vehicle_id, 'transport', !transport.availability_status)}
                      >
                        {transport.availability_status ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-properties">No transports owned by this user</p>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default OwnerProperties;