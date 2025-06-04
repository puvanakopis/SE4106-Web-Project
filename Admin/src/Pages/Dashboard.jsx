import { useState } from "react";
import { assets, dashboardAccommodationData, dashboardTransportData, } from "../Assets/assets";
import "./Dashboard.css";
import useScrollAnimation from "../hooks/useScrollAnimation";

const Dashboard = () => {
  const [AccommodationData] = useState(dashboardAccommodationData);
  const [TransportData] = useState(dashboardTransportData);

  const [accRef, accVisible] = useScrollAnimation();
  const [transRef, transVisible] = useScrollAnimation();

  return (
    <div className="dashboard-container">
      {/* ------------------ Accommodation ------------------ */}
      <div
        ref={accRef}
        className={`accommodation-container ScrollingAnimation ${accVisible ? "show" : ""
          }`}
      >
        <div>
          <div className="dashboard-title">Accommodation</div>
          <div className="dashboard-summary">
            <div className="summary-box">
              <img
                src={assets.totalBookingIcon}
                alt="Total Booking Icon"
                className="icon"
              />
              <div>
                <p className="summary-title">Total Booking</p>
                <p className="summary-value">{AccommodationData.totalBookings}</p>
              </div>
            </div>

            <div className="summary-box">
              <img
                src={assets.totalRevenueIcon}
                alt="Total Revenue Icon"
                className="icon"
              />
              <div>
                <p className="summary-title">Total Revenue</p>
                <p className="summary-value">Rs {AccommodationData.totalRevenue}.00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-title">Recent Bookings</div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th className="hide-on-sm">Room Name</th>
                <th className="center">Total Amount</th>
                <th className="center">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {AccommodationData.bookings.map((item, index) => (
                <tr key={index}>
                  <td>{item.user?.username || "Unknown"}</td>
                  <td>{item.user?.phone || "N/A"}</td>
                  <td>{item.user?.role || "N/A"}</td>
                  <td className="hide-on-sm">{item.room?.roomType || "Unknown"}</td>
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
      <div
        ref={transRef}
        className={`transport-container ScrollingAnimation ${transVisible ? "show" : ""
          }`}
      >
        <div>
          <div className="dashboard-title">Transport</div>
          <div className="dashboard-summary">
            <div className="summary-box">
              <img
                src={assets.totalBookingIcon}
                alt="Total Booking Icon"
                className="icon"
              />
              <div>
                <p className="summary-title">Total Booking</p>
                <p className="summary-value">{TransportData.totalBookings}</p>
              </div>
            </div>

            <div className="summary-box">
              <img
                src={assets.totalRevenueIcon}
                alt="Total Revenue Icon"
                className="icon"
              />
              <div>
                <p className="summary-title">Total Revenue</p>
                <p className="summary-value">Rs {TransportData.totalRevenue}.00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-title">Recent Bookings</div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th className="hide-on-sm">Transport Name</th>
                <th className="center">Total Amount</th>
                <th className="center">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {TransportData.bookings.map((item, index) => (
                <tr key={index}>
                  <td>{item.renter?.username || "Unknown"}</td>
                  <td>{item.renter?.phone || "N/A"}</td>
                  <td>{item.renter?.role || "N/A"}</td>
                  <td className="hide-on-sm">
                    {item.vehicle
                      ? `${item.vehicle.brand} ${item.vehicle.model}`
                      : "Unknown"}
                  </td>
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