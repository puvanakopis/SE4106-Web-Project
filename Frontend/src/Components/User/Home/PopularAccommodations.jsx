import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PopularAccommodations.css';

const PopularAccommodations = () => {
    const navigate = useNavigate();
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedAccommodations, setSavedAccommodations] = useState(() => {
        const saved = localStorage.getItem('savedAccommodations');
        return saved ? JSON.parse(saved) : [];
    });

    // Fetch top 3 rated accommodations
    useEffect(() => {
        const fetchTopRatedAccommodations = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5000/api/accommodations?limit=3&sort_by=averageRating&sort_order=desc`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch accommodations');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    const topRated = data.accommodations
                        .filter(acc => acc.averageRating > 0)
                        .slice(0, 3);
                    setAccommodations(topRated);
                } else {
                    throw new Error(data.message || 'Failed to fetch accommodations');
                }
            } catch (err) {
                console.error('Error fetching accommodations:', err);
                toast.error('Failed to load featured accommodations');
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedAccommodations();
    }, []);

    const toggleSaveAccommodation = (accommodationId, accommodationName, e) => {
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

    const StarRating = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, index) => {
                    if (index < fullStars) {
                        return <FaStar key={index} className="star-icon filled" />;
                    } else if (index === fullStars && hasHalfStar) {
                        return <FaStar key={index} className="star-icon half-filled" />;
                    } else {
                        return <FaStar key={index} className="star-icon" />;
                    }
                })}
            </div>
        );
    };

    // Function to get the correct image URL
    const getImageUrl = (accommodation) => {
        if (accommodation.accommodation_images && accommodation.accommodation_images.length > 0) {
            // Check if the image path is already a full URL or needs the base URL
            const imagePath = accommodation.accommodation_images[0];
            if (imagePath.startsWith('http')) {
                return imagePath;
            } else if (imagePath.startsWith('/uploads/')) {
                return `http://localhost:5000${imagePath}`;
            } else {
                return `http://localhost:5000/uploads/accommodations/${imagePath}`;
            }
        }
        // Return a default image if no images available
        return '/images/default-accommodation.jpg';
    };

    if (loading) {
        return (
            <div className="PopularAccommodations">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading featured accommodations...</p>
                </div>
            </div>
        );
    }

    if (accommodations.length === 0) {
        return (
            <div className="PopularAccommodations">
                <div className="no-accommodations">
                    <p>No featured accommodations available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="PopularAccommodations">
            <section className="featured-properties">
                <div className="section-header">
                    <h2>Featured Accommodations</h2>
                    <p>Top-rated stays selected by our travel experts</p>
                </div>

                <div className="properties-grid">
                    {accommodations.map(accommodation => (
                        <div
                            className="card"
                            key={accommodation._id}
                            onClick={() => {
                                navigate(`/accommodation/${accommodation._id}`)
                            }}
                        >
                            <img
                                src={getImageUrl(accommodation)}
                                alt={accommodation.accommodation_name}
                                className="image"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = '/images/default-accommodation.jpg';
                                }}
                            />
                            <div className="property-badge">{accommodation.accommodation_type}</div>
                            <button
                                className={`save-button ${savedAccommodations.includes(accommodation._id) ? 'saved' : ''}`}
                                onClick={(e) => toggleSaveAccommodation(accommodation._id, accommodation.accommodation_name, e)}
                                aria-label={savedAccommodations.includes(accommodation._id) ? 'Remove from saved' : 'Save this accommodation'}
                            >
                                {savedAccommodations.includes(accommodation._id) ? (
                                    <FaHeart className="icon-heart-filled" />
                                ) : (
                                    <FaRegHeart className="icon-heart-outline" />
                                )}
                            </button>
                            <div className="accommodation-info">
                                <h3>{accommodation.accommodation_name}</h3>
                                <p className="location">{accommodation.address}</p>
                                <p className="property-type">{accommodation.property_type} • {accommodation.bedrooms} bed • {accommodation.bathrooms} bath</p>

                                <div className="rating-container">
                                    <StarRating rating={accommodation.averageRating} />
                                    <span className="rating-text">
                                        {accommodation.averageRating.toFixed(1)} ({accommodation.totalReviews} reviews)
                                    </span>
                                </div>

                                <div className="price-action">
                                    <p className="price">Rs {accommodation.price_per_month?.toLocaleString()}/= per month</p>
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