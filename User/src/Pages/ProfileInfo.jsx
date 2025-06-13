import React, { useState } from "react";
import "./ProfileInfo.css";

const ProfileInfo = () => {
  const [activeSection, setActiveSection] = useState("account-info");

  return (
    <div className="profile">

      <div className="user_name">
        <div>Hi , Puvanakopis M</div>
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
            Change Password Section
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
                <input type="text" defaultValue="Mehanathan Puvanakopis" />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue="Puvanakopis M" />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue="puvanakopis@gmail.com" />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" defaultValue="0751134664" />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select>
                  <option>Student</option>
                  <option>Lecturer</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" defaultValue="No. 123, University Road, Belihuloya, Sabaragamuwa" />
              </div>

              <div className="form-group button-group">
                <button type="submit" className="save-button">Save</button>
              </div>
            </form>
          </div>

        )}




        {/* -------------- delete Section -------------- */}
        {activeSection === "delete" && (
          <div className="profile-form-section">
            <form className="profile-form">
              <div className="form-group delete">
                <label>⚠️  Delete Account Warning</label>
                <div>
                  Deleting your account will permanently remove your data, cancel active bookings, and anonymize your reviews. This action cannot be undone. Make sure to cancel any ongoing bookings first.
                </div>

              </div>

              <div className="form-group">
                <label>Confirm  Password</label>
                <input type="password" />
              </div>

              <div className="form-group button-group">
                <button type="submit" className="save-button">Delete Accountt</button>
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
                <button type="submit" className="save-button">Update Password</button>
              </div>

            </form>

          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
