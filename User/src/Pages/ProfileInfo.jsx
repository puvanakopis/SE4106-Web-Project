import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "./ProfileInfo.css";

const ProfileInfo = () => {
  const [activeSection, setActiveSection] = useState("account-info");
  const { user } = useContext(AuthContext);
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.PhoneNumber || "",
    role: user?.role || "",
    address: user?.address || ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="profile">
      <div className="user_name">
        <div>Hi, {user.displayName}</div>
      </div>

      <div className="profile-container">
        {/* -------------- Sidebar -------------- */}
        <div className="profile-sidebar">
          <div
            onClick={() => setActiveSection("account-info")}
            className={`profile-title ${activeSection === "account-info" ? "active" : ""}`}
          >
            Account Info
          </div>
          <div
            onClick={() => setActiveSection("password")}
            className={`profile-title ${activeSection === "password" ? "active" : ""}`}
          >
            Change Password
          </div>
          <div
            onClick={() => setActiveSection("delete")}
            className={`profile-title ${activeSection === "delete" ? "active" : ""}`}
          >
            Delete Account
          </div>
        </div>

        {/* -------------- account info Section -------------- */}
        {activeSection === "account-info" && (
          <div className="profile-form-section">
            <form className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group button-group">
                <button type="submit" className="save-button-div">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* -------------- delete Section -------------- */}
        {activeSection === "delete" && (
          <div className="profile-form-section">
            <form className="profile-form">
              <div className="form-group delete">
                <label>⚠️ Delete Account Warning</label>
                <div>
                  Deleting your account will permanently remove your data, cancel active bookings, and anonymize your reviews. This action cannot be undone. Make sure to cancel any ongoing bookings first.
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" />
              </div>

              <div className="form-group button-group">
                <button type="submit" className="save-button-div">Delete Account</button>
              </div>
            </form>
          </div>
        )}

        {/* -------------- password Section -------------- */}
        {activeSection === "password" && (
          <div className="profile-form-section">
            <form className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" />
              </div>

              <div className="form-group button-group">
                <button type="submit" className="save-button-div">Update Password</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;