import React, { useState } from 'react';
import { assets, roomsData } from '../Assets/assets';
import './ListRoom.css';

const ListRoom = () => {
  const [room] = useState(roomsData);

  // Calculate room statistics
  const totalRooms = room.length;
  const availableRooms = room.filter(item => item.isAvailable).length;
  const occupiedRooms = totalRooms - availableRooms;
  const averagePrice = room.reduce((sum, item) => sum + item.pricePerMonth, 0) / totalRooms;

  return (
    <div className="listroom-container">
      <div className="listroom-title">Room Listing</div>

      {/* ------------ Room Statistics Summary ------------ */}
      <div className="dashboard-summary">
        {/* Total Rooms */}
        <div className="summary-box">
          <img src={assets.totalBookingIcon} alt="Total Rooms Icon" className="icon" />
          <div>
            <p className="summary-title">Total Rooms</p>
            <p className="summary-value">{totalRooms}</p>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="summary-box">
          <img src={assets.totalBookingIcon} alt="Available Rooms Icon" className="icon" />
          <div>
            <p className="summary-title">Available Rooms</p>
            <p className="summary-value">{availableRooms}</p>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="summary-box">
          <img src={assets.totalBookingIcon} alt="Occupied Rooms Icon" className="icon" />
          <div>
            <p className="summary-title">Occupied Rooms</p>
            <p className="summary-value">{occupiedRooms}</p>
          </div>
        </div>

        {/* Average Price */}
        <div className="summary-box">
          <img src={assets.totalRevenueIcon} alt="Average Price Icon" className="icon" />
          <div>
            <p className="summary-title">Average Price</p>
            <p className="summary-value">Rs {averagePrice.toFixed(2)}</p>
          </div>
        </div>
      </div>



      {/* ------------ Room Listing Table ------------ */}

      <div className="room-table-wrapper mt-3">
        <table className="room-table">

          {/* Table Headers */}
          <thead>
            <tr>
              <th className="hide-on-sm">Room Name</th>
              <th className="center">Facility</th>
              <th className="center">Price/Month</th>
              <th className="center">Available</th>
            </tr>
          </thead>

          {/* Map room data */}
          <tbody>
            {room.map((item, index) => (
              <tr key={index}>
                <td className="hide-on-sm">{item.roomType}</td>
                <td className="center">{item.amenities.join(', ')}</td>
                <td className="center">Rs {item.pricePerMonth}.00</td>
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