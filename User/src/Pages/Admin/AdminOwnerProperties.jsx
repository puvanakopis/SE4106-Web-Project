import './AdminOwnerProperties.css';
import { roomsDummyData, vehicleData } from '../../Assets/assets';

const AdminOwnerProperties = ({ owner, onClose, onEdit, onDelete, onBlockToggle, onAddRoom, onAddTransport }) => {
  const ownedRooms = roomsDummyData.filter(room => room.owner.id === owner.id);
  
  const ownedTransports = vehicleData.filter(vehicle => vehicle.owner.id === owner.id);

  return (
    <div className="owner-properties">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{owner.username}'s Properties</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="owner-info">
          <img 
            src={owner.profile_pic} 
            alt={owner.username} 
            className="owner-profile-pic"
          />
          <div className="owner-details">
            <h3>{owner.fullName}</h3>
            <p>Email: {owner.email}</p>
            <p>Phone: {owner.phoneNumber}</p>
          </div>
        </div>
        
        <div className="properties-section">
          <div className="section-header">
            <h3>Owned Rooms ({ownedRooms.length})</h3>
            <button className="add-button" onClick={onAddRoom}>+ Add Room</button>
          </div>
          {ownedRooms.length > 0 ? (
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>ID</th>
                  <th>Hotel</th>
                  <th>Price/Month</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ownedRooms.map(room => (
                  <tr key={room._id}>
                    <td>{room.roomType}</td>
                    <td>{room._id}</td>
                    <td>{room.hotel.name}</td>
                    <td>Rs. {room.pricePerMonth.toLocaleString()}</td>
                    
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
            <button className="add-button" onClick={onAddTransport}>+ Add Transport</button>
          </div>
          {ownedTransports.length > 0 ? (
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Transports Type</th>
                  <th>ID</th>
                  <th>Brand/Model</th>
                  <th>Price/Day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ownedTransports.map(transport => (
                  <tr key={transport.vehicle_id}>
                    <td>{transport.vehicle_type}</td>
                    <td>{transport.vehicle_id}</td>
                    <td>{transport.brand} {transport.model}</td>
                    <td>Rs. {transport.rental_price_per_day.toLocaleString()}</td>
              
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

export default AdminOwnerProperties;