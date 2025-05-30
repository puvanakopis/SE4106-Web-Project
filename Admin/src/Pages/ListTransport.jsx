import React from 'react';
import { transportData } from '../Assets/assets';
import './ListTransport.css';

const ListTransport = () => {
  return (
    <div className="listtransport-container">
      <div className="listtransport-title">Transport Listing</div>

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
                <td className="center">{item.pricePerKm}</td>
                <td className="center">
                  <input 
                    type="checkbox" 
                    className="peer" 
                    checked={true} 
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