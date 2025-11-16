import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accommodationsData } from '../../../Assets/assets';
import { FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import StarRating from '../../Rating/StarRating';
import './PopularRooms.css';

const PopularAccommodations = () => {
    const navigate = useNavigate();
    const [savedAccommodations, setSavedAccommodations] = useState(() => {
        const saved = localStorage.getItem('savedAccommodations');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleSaveAccommodation = (accommodationId, e) => {
        e.stopPropagation();
        setSavedAccommodations((prev) => {
            const isSaved = prev.includes(accommodationId);
            const newSaved = isSaved
                ? prev.filter((id) => id !== accommodationId)
                : [...prev, accommodationId];
            localStorage.setItem('savedAccommodations', JSON.stringify(newSaved));
            return newSaved;
        });
    };

    return (
        <div className="PopularAccommodations">
            <section className="featured-properties">
                <div className="section-header">
                    <h2>Featured Accommodations</h2>
                    <p>Top-rated stays selected by our travel experts</p>
                </div>

                <div className="properties-grid">
                    {accommodationsData.slice(0, 3).map(accommodation => (
                        <div
                            className="card"
                            key={accommodation._id}
                            onClick={() => {
                                navigate(`/accommodation/${accommodation._id}`)
                            }}
                        >
                            <img
                                src={accommodation.images[0]}
                                alt={`${accommodation.accommodationName}`}
                                className="image"
                                loading="lazy"
                            />
                            <div className="property-badge">{accommodation.accommodationType}</div>
                            <button
                                className={`save-button ${savedAccommodations.includes(accommodation._id) ? 'saved' : ''}`}
                                onClick={(e) => toggleSaveAccommodation(accommodation._id, e)}
                                aria-label={savedAccommodations.includes(accommodation._id) ? 'Remove from saved' : 'Save this accommodation'}
                            >
                                {savedAccommodations.includes(accommodation._id) ? (
                                    <FaHeart className="icon-heart-filled" />
                                ) : (
                                    <FaRegHeart className="icon-heart-outline" />
                                )}
                            </button>
                            <div className="accommodation-info">
                                <h3>{accommodation.accommodationType}</h3>
                                <p>Location – {accommodation.location}</p>

                                <div className="rating-container">
                                    <StarRating rating={accommodation.averageRating} />
                                    <span className="rating-text">
                                        {accommodation.averageRating.toFixed(1)} ({accommodation.totalReviews} reviews)
                                    </span>
                                </div>

                                <div className="price-action">
                                    <p>Rs {accommodation.pricePerMonth.toLocaleString()}/= per month</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/accommodation/${accommodation._id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="view-all-button"
                    onClick={() => {
                        navigate('/accommodation')
                    }}
                >
                    View All Accommodations <FaArrowRight className="arrow-icon" />
                </button>
            </section>
        </div>
    );
};

export default PopularAccommodations;