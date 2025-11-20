import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            {/* Main Error Content */}
            <section className="error-content">
                <div className="error-header">
                    <h1 className="error-code">404</h1>
                    <h2 className="error-title">Page Not Found</h2>
                    <p className="error-messages">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="error-details">
                    <p>
                        While you're here, why not explore our accommodation solutions for
                        Sabaragamuwa University students and staff?
                    </p>

                    <div className="error-actions">
                        <Link to="/" className="error-button primary"  >Return Home</Link>
                        <Link to="/about" className="error-button">About Our Service</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NotFound;