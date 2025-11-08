import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "./ProfileInfo.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileInfo = () => {
  const navigator = useNavigate()

  const { user, updateProfile, changePassword, deleteAccount, logout } = useContext(AuthContext);

  const [activeSection, setActiveSection] = useState("account-info");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    address: user?.address || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async (e) => {
    e.preventDefault();

    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      await deleteAccount(deletePassword);
      toast.success('Account deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      logout()
      navigator('/')
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="profile">
      <div className="user_name">
        <div>Hi, {user.displayName || user.fullName}</div>
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
            <form className="profile-form" onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Name to display publicly"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
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
                  placeholder="Your address"
                />
              </div>

              <div className="form-group button-group">
                <button
                  type="submit"
                  className="save-button-div"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------- delete Section -------------- */}
        {activeSection === "delete" && (
          <div className="profile-form-section">
            <form className="profile-form" onSubmit={handleAccountDelete}>
              <div className="form-group delete">
                <label>⚠️ Delete Account Warning</label>
                <div>
                  Deleting your account will permanently remove your data, cancel active bookings, and anonymize your reviews. This action cannot be undone. Make sure to cancel any ongoing bookings first.
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group button-group">
                <button
                  type="submit"
                  className="save-button-div delete-btn"
                  disabled={loading || !deletePassword}
                >
                  {loading ? 'Deleting...' : 'Delete Account Permanently'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------- password Section -------------- */}
        {activeSection === "password" && (
          <div className="profile-form-section">
            <form className="profile-form" onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group button-group">
                <button
                  type="submit"
                  className="save-button-div"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;