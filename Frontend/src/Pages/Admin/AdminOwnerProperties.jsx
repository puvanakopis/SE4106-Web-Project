import './AdminOwnerProperties.css';
import { roomsData, vehicleData } from '../../Assets/assets';

const AdminOwnerProperties = ({ owner, onClose, onEdit, onDelete, onBlockToggle, onAddRoom, onAddTransport }) => {
  // Filter rooms owned by this specific owner
  const ownedRooms = roomsData.filter(room => room.owner.id === owner.id);
  
  // Filter vehicles owned by this specific owner
  const ownedTransports = vehicleData.filter(vehicle => vehicle.owner.id === owner.id);

  return (
    <div className="owner-properties">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{owner.FullName}'s Properties</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="owner-info">
          <img 
            src={owner.profile_pic} 
            alt={owner.FullName} 
            className="owner-profile-pic"
          />
          <div className="owner-details">
            <h3>{owner.FullName}</h3>
            <p>Email: {owner.email}</p>
            <p>Phone: {owner.PhoneNumber}</p>
            <p>Status: <span className={`status-badge ${owner.Status === "Active" ? 'active' : 'blocked'}`}>
              {owner.Status}
            </span></p>
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
                  <th>Room Name</th>
                  <th>Type</th>
                  <th>Price/Month</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ownedRooms.map(room => (
                  <tr key={room._id}>
                    <td>{room.roomName}</td>
                    <td>{room.roomType}</td>
                    <td>Rs. {room.pricePerMonth.toLocaleString()}</td>
                    <td className="location-cell">{room.location}</td>
                    <td>
                      <span className={`status-badge ${room.isAvailable ? 'available' : 'occupied'}`}>
                        {room.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                      {room.Status === "Blocked" && <span className="blocked-badge">Blocked</span>}
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
            <h3>Owned Vehicles ({ownedTransports.length})</h3>
            <button className="add-button" onClick={onAddTransport}>+ Add Vehicle</button>
          </div>
          {ownedTransports.length > 0 ? (
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Price/Day</th>
                  <th>Features</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ownedTransports.map(vehicle => (
                  <tr key={vehicle.vehicle_id}>
                    <td>{vehicle.brand} {vehicle.model}</td>
                    <td>{vehicle.vehicle_type}</td>
                    <td>Rs. {vehicle.rental_price_per_day.toLocaleString()}</td>
                    <td className="features-cell">
                      {vehicle.features.slice(0, 2).join(', ')}
                      {vehicle.features.length > 2 && ` +${vehicle.features.length - 2}`}
                    </td>
                    <td>
                      <span className={`status-badge ${vehicle.isAvailable ? 'available' : 'occupied'}`}>
                        {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-button edit" onClick={() => onEdit(vehicle)}>
                        Edit
                      </button>
                      <button className="action-button delete" onClick={() => onDelete(vehicle.vehicle_id, 'transport')}>
                        Delete
                      </button>
                      <button 
                        className={`action-button ${vehicle.isAvailable ? 'block' : 'unblock'}`}
                        onClick={() => onBlockToggle(vehicle.vehicle_id, 'transport', !vehicle.isAvailable)}
                      >
                        {vehicle.isAvailable ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-properties">No vehicles owned by this user</p>
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