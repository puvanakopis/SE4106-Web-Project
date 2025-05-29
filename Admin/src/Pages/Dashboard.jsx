import { useState } from "react";
import { assets, dashboardDummyData, transportDashboardDummyData } from "../Assets/assets";
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData] = useState(dashboardDummyData);
  const [dashboardTransportData] = useState(transportDashboardDummyData);

  return (
    <div className="dashboard-container">

      {/* ------------------ Accommodation ------------------ */}
      <div className="accommodation-container">
        <div>
          <div className="dashboard-title">Accommodation</div>
          <div className="dashboard-summary">

            {/* Total Booking */}
            <div className="summary-box">
              <img src={assets.totalBookingIcon} alt="Total Booking Icon" className="icon" />
              <div>
                <p className="summary-title">Total Booking</p>
                <p className="summary-value">{dashboardData.totalBookings}</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="summary-box">
              <img src={assets.totalRevenueIcon} alt="Total Revenue Icon" className="icon" />
              <div>
                <p className="summary-title">Total Revenue</p>
                <p className="summary-value">Rs {dashboardData.totalRevenue}.00</p>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-title">Recent Bookings</div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th className="hide-on-sm">Room Name</th>
                <th className="center">Total Amount</th>
                <th className="center">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.bookings.map((item, index) => (
                <tr key={index}>
                  <td>{item.user.username}</td>
                  <td className="hide-on-sm">{item.room.roomType}</td>
                  <td>Rs {item.totalPrice}.00</td>
                  <td className="center">
                    {item.isPaid ? (
                      <span className="paid">Paid</span>
                    ) : (
                      <span className="pending">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>




      {/* ------------------ Transport ------------------ */}
      <div className="transport-container">
        <div>
          <div className="dashboard-title">Transport</div>
          <div className="dashboard-summary">

            {/* Total Booking */}
            <div className="summary-box">
              <img src={assets.totalBookingIcon} alt="Total Booking Icon" className="icon" />
              <div>
                <p className="summary-title">Total Booking</p>
                <p className="summary-value">{dashboardTransportData.totalBookings}</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="summary-box">
              <img src={assets.totalRevenueIcon} alt="Total Revenue Icon" className="icon" />
              <div>
                <p className="summary-title">Total Revenue</p>
                <p className="summary-value">Rs {dashboardTransportData.totalRevenue}.00</p>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-title">Recent Bookings</div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th className="hide-on-sm">Transport Name</th>
                <th className="center">Total Amount</th>
                <th className="center">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardTransportData.bookings.map((item, index) => (
                <tr key={index}>
                  <td>{item.user.username}</td>
                  <td className="hide-on-sm">{item.vehicle.title}</td>
                  <td>Rs {item.totalPrice}.00</td>
                  <td className="center">
                    {item.isPaid ? (
                      <span className="paid">Paid</span>
                    ) : (
                      <span className="pending">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;