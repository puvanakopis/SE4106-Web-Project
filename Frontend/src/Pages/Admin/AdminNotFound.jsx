import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNotFound.css';

const AdminNotFound = () => {
    return (
        <div className="admin-not-found-container">
            {/* Main Error Content */}
            <section className="admin-error-content">
                <div className="admin-error-header">
                    <h1 className="admin-error-code">404</h1>
                    <h2 className="admin-error-title">Page Not Found</h2>
                    <p className="admin-error-message">
                        The requested admin resource doesn't exist or has been moved.
                    </p>
                </div>

                <div className="admin-error-details">
                    <p>
                        Please check the URL or return to the admin dashboard.
                    </p>

                    <div className="admin-error-actions">
                        <Link to="/" className="admin-error-button primary">Admin Dashboard</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminNotFound;