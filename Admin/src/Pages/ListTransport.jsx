import React, { useEffect, useState } from "react";
import { assets, vehicleData as initialVehicleData, vehicleBookingsData } from "../Assets/assets";
import "./ListTransport.css";

const ListTransport = () => {

  const [vehicleData, setVehicleData] = useState(initialVehicleData);


  // Scroll animation effect
  useEffect(() => {
    const elements = document.querySelectorAll(".ScrollingAnimation");

    const handleScroll = () => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          el.classList.add("show");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  // Calculate summary statistics
  const totalVehicles = vehicleData.length;
  const availableVehicles = vehicleData.filter((v) => v.availability_status).length;
  const bookedVehicles = totalVehicles - availableVehicles;

  const totalBookings = vehicleBookingsData.length;
  const totalRevenue = vehicleBookingsData
    .filter((booking) => booking.isPaid)
    .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

  const averagePrice =
    vehicleData.reduce((sum, v) => sum + (v.rental_price_per_day || 0), 0) / totalVehicles || 0;

  const vehicleTypeCounts = vehicleData.reduce((acc, v) => {
    acc[v.vehicle_type] = (acc[v.vehicle_type] || 0) + 1;
    return acc;
  }, {});


  // Handler to remove vehicle
  const handleRemoveVehicle = (vehicleId) => {
    const filteredVehicles = vehicleData.filter((v) => v.vehicle_id !== vehicleId);
    setVehicleData(filteredVehicles);
  };

  return (
    <div className="listtransport-container">
      <div className="listtransport-title ScrollingAnimation">Transport Listing</div>


      {/* ------------------ Dashboard Summary ------------------ */}
      <div className="four dashboard-summary ScrollingAnimation">
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

        {/* Total Bookings */}
        <div className="summary-box">
          <img src={assets.totalBookingIcon} alt="Total Bookings" className="icon" />
          <div>
            <p className="summary-title">Total Bookings</p>
            <p className="summary-value">{totalBookings}</p>
          </div>
        </div>
      </div>


      <div className="dashboard-summary ScrollingAnimation">

        {/* Total Revenue */}
        <div className="summary-box">
          <img src={assets.totalRevenueIcon} alt="Total Revenue" className="icon" />
          <div>
            <p className="summary-title">Total Revenue</p>
            <p className="summary-value">LKR {totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Average Price per Day */}
        <div className="summary-box">
          <img src={assets.totalRevenueIcon} alt="Average Price" className="icon" />
          <div>
            <p className="summary-title">Avg. Price/Day</p>
            <p className="summary-value">LKR {averagePrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Vehicle type distribution chart */}
      <div className="vehicle-type-distribution ScrollingAnimation">
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




      {/* ------------------ Transport Data Table ------------------ */}

      <div className="transport-table-wrapper mt-3 ScrollingAnimation">
        <table className="transport-table">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Vehicle Type</th>
              <th className="hide-on-sm">Vehicle Name</th>
              <th className="center">Capacity</th>
              <th className="center">Price/Day</th>
              <th className="center">Available</th>
              <th className="hide-on-sm">Owner</th>
              <th className="center">Remove</th>
            </tr>
          </thead>


          {/* ------------------ Vehicle Data map ------------------ */}

          <tbody>
            {vehicleData.map((item, index) => {

              return (
                <tr key={index}>
                  <td>{item.vehicle_id}</td>
                  <td>{item.vehicle_type}</td>
                  <td className="hide-on-sm">{item.brand} {item.model}</td>
                  <td className="center">{item.seating_capacity}</td>
                  <td className="center">LKR {item.rental_price_per_day.toFixed(2)}</td>
                  <td className="center">{item.availability_status ? "Yes" : "No"}</td>
                  <td className="hide-on-sm">{item.owner.display_name}</td>
                  <td className="center">
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveVehicle(item.vehicle_id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListTransport;