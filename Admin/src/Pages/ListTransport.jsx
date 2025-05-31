import React from 'react';
import { assets, transportData } from '../Assets/assets';
import './ListTransport.css';

const ListTransport = () => {
  // Calculate transport statistics
  const totalVehicles = transportData.length;
  const availableVehicles = transportData.filter(item => item.isAvailable).length;
  const bookedVehicles = totalVehicles - availableVehicles;
  const averagePrice = transportData.reduce((sum, item) => sum + item.pricePerKm, 0) / totalVehicles;

  // Group by vehicle type
  const vehicleTypeCounts = transportData.reduce((acc, item) => {
    acc[item.vehicleType] = (acc[item.vehicleType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="listtransport-container">
      <div className="listtransport-title">Transport Listing</div>

      {/* ------------ Transport Statistics Summary ------------ */}
      <div className="dashboard-summary">
        {/* Total Vehicles */}
        <div className="summary-box">
          <img src={assets.totalBookingIcon} alt="Total Vehicles" className="icon" />
          <div>
            <p className="summary-title">Total Vehicles</p>
            <p className="summary-value">{totalVehicles}</p>
          </div>
        </div>

        {/* Available Vehicles */}
        <div className="summary-box">
          <img src={assets.totalBookingIcon} alt="Available Vehicles" className="icon" />
          <div>
            <p className="summary-title">Available</p>
            <p className="summary-value">{availableVehicles}</p>
          </div>
        </div>

        {/* Booked Vehicles */}
        <div className="summary-box">
          <img src={assets.totalBookingIcon} alt="Booked Vehicles" className="icon" />
          <div>
            <p className="summary-title">Booked</p>
            <p className="summary-value">{bookedVehicles}</p>
          </div>
        </div>

        {/* Average Price */}
        <div className="summary-box">
          <img src={assets.totalRevenueIcon} alt="Average Price" className="icon" />
          <div>
            <p className="summary-title">Avg. Price/Km</p>
            <p className="summary-value">LKR {averagePrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* ------------ Vehicle Type Distribution ------------ */}
      <div className="vehicle-type-distribution">
        <h3 className="distribution-title">Vehicle Type Distribution</h3>
        <div className="distribution-grid">
          {Object.entries(vehicleTypeCounts).map(([type, count]) => (
            <div key={type} className="distribution-item">
              <div className="type-label">{type}</div>
              <div className="type-count">{count}</div>
              <div className="type-bar">
                <div 
                  className="bar-fill"
                  style={{ width: `${(count / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------ Transport Table ------------ */}
      <div className="transport-table-wrapper mt-3">
        <table className="transport-table">
          <thead>
            <tr>
              <th>Vehicle Type</th>
              <th className="hide-on-sm">Vehicle Name</th>
              <th className="center">Capacity</th>
              <th className="center">Price/Km</th>
              <th className="center">Available</th>
            </tr>
          </thead>
          <tbody>
            {transportData.map((item, index) => (
              <tr key={index}>
                <td>{item.vehicleType}</td>
                <td className="hide-on-sm">{item.vehicleName}</td>
                <td className="center">{item.capacity}</td>
                <td className="center">LKR {item.pricePerKm.toFixed(2)}</td>
                <td className="center">
                  <input 
                    type="checkbox" 
                    className="peer" 
                    checked={item.isAvailable} 
                    readOnly 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListTransport;