import React, { useState } from "react";
import "./ProfileInfo.css";
import "./Animation/animations.css";

const ProfileInfo = () => {
  // ------------------ State Management ------------------
  const [activeSection, setActiveSection] = useState("account-info");

  return (
    <div className="profile fade-in">
      {/* --------------------------- User Greeting --------------------------- */}
      <div className="user_name slide-in-left delay-100">
        <div>Hi , Puvanakopis M</div>
      </div>

      {/* --------------------------- Main Container --------------------------- */}
      <div className="profile-container fade-in delay-200">
        {/* --------------------------- Sidebar Navigation --------------------------- */}
        <div className="profile-sidebar slide-in-left delay-300">
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

        {/* --------------------------- Account Info Section --------------------------- */}
        {activeSection === "account-info" && (
          <div className="profile-form-section slide-in-right">
            <form className="profile-form">
              <div className="form-group fade-in delay-100">
                <label>Full Name</label>
                <input type="text" defaultValue="Mehanathan Puvanakopis" />
              </div>

              <div className="form-group fade-in delay-200">
                <label>Display Name</label>
                <input type="text" defaultValue="Puvanakopis M" />
              </div>

              <div className="form-group fade-in delay-300">
                <label>Email Address</label>
                <input type="email" defaultValue="puvanakopis@gmail.com" />
              </div>

              <div className="form-group fade-in delay-400">
                <label>Phone Number</label>
                <input type="tel" defaultValue="0751134664" />
              </div>

              <div className="form-group fade-in delay-500">
                <label>Role</label>
                <select>
                  <option>Student</option>
                  <option>Lecturer</option>
]                </select>
              </div>

              <div className="form-group fade-in delay-600">
                <label>Address</label>
                <input type="text" defaultValue="No. 123, University Road, Belihuloya, Sabaragamuwa" />
              </div>

]              <div className="form-group button-group fade-in delay-700">
                <button type="submit" className="save-button-div">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* --------------------------- Delete Account Section --------------------------- */}
        {activeSection === "delete" && (
          <div className="profile-form-section slide-in-right">
            <form className="profile-form">
              <div className="form-group delete fade-in delay-100">
                <label>⚠️  Delete Account Warning</label>
                <div>
                  Deleting your account will permanently remove your data, cancel active bookings, and anonymize your reviews. This action cannot be undone. Make sure to cancel any ongoing bookings first.
                </div>
              </div>

              <div className="form-group fade-in delay-200">
                <label>Confirm  Password</label>
                <input type="password" />
              </div>

              <div className="form-group button-group fade-in delay-300">
                <button type="submit" className="save-button-div">Delete Account</button>
              </div>
            </form>
          </div>
        )}

        {/* --------------------------- Change Password Section --------------------------- */}
        {activeSection === "password" && (
          <div className="profile-form-section slide-in-right">
            <form className="profile-form">
              <div className="form-group fade-in delay-100">
                <label>Current Password</label>
                <input type="password" />
              </div>

              <div className="form-group fade-in delay-200">
                <label>New Password</label>
                <input type="password" />
              </div>

              <div className="form-group fade-in delay-300">
                <label>Confirm New Password</label>
                <input type="password" />
              </div>

              <div className="form-group button-group fade-in delay-400">
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