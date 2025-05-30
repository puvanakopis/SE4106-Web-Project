import React, { useState } from 'react';
import { roomsData } from '../Assets/assets';
import './ListRoom.css'; // 👈 Add this line

const ListRoom = () => {
  const [room] = useState(roomsData);

  return (
    <div className="listroom-container">
      <div className="listroom-title">Room Listing</div>

      <div className="room-table-wrapper mt-3">
        <table className="room-table">
          <thead>
            <tr>
              <th className="hide-on-sm">Room Name</th>
              <th className="center">Facility</th>
              <th className="center">Price/Month</th>
              <th className="center">Available</th>
            </tr>
          </thead>
          <tbody>
            {room.map((item, index) => (
              <tr key={index}>
                <td className="hide-on-sm">{item.roomType}</td>
                <td className="center">{item.amenities.join(', ')}</td>
                <td className="center">{item.pricePerMonth}</td>
                <td className="center">
                  <input type="checkbox" className="peer" checked={item.isAvailable} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
