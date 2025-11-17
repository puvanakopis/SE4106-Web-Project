import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './PopularAccommodations.css';
import 'react-toastify/dist/ReactToastify.css';

const PopularAccommodations = ({ setLoading }) => {
    const navigate = useNavigate();
    const [accommodations, setAccommodations] = useState([]);
    const [savedAccommodations, setSavedAccommodations] = useState(() => {
        const saved = localStorage.getItem('savedAccommodations');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchTopRatedAccommodations = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:5000/api/accommodations?limit=3&sort_by=averageRating&sort_order=desc`
                );

                if (!response.ok) throw new Error("Failed to fetch accommodations");

                const data = await response.json();

                if (data.success) {
                    const topRated = data.accommodations
                        .filter(a => a.averageRating > 0)
                        .slice(0, 3);

                    setAccommodations(topRated);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load accommodations");
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedAccommodations();
    }, []);

    const toggleSaveAccommodation = (id, name, e) => {
        e.stopPropagation();
        setSavedAccommodations(prev => {
            const isSaved = prev.includes(id);
            const updated = isSaved ? prev.filter(x => x !== id) : [...prev, id];

            localStorage.setItem("savedAccommodations", JSON.stringify(updated));

            toast.success(
                isSaved ? `Removed ${name} from saved` : `Saved ${name} to favorites`
            );

            return updated;
        });
    };

    const StarRating = ({ rating }) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;

        return (
            <div className="star-rating">
                {[...Array(5)].map((_, i) => {
                    if (i < full) return <FaStar key={i} className="star-icon filled" />;
                    if (i === full && half) return <FaStar key={i} className="star-icon half-filled" />;
                    return <FaStar key={i} className="star-icon" />;
                })}
            </div>
        );
    };

    const getImageUrl = (acc) => {
        if (acc.accommodation_images?.length > 0) {
            const img = acc.accommodation_images[0];
            if (img.startsWith('http')) return img;
            if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
            return `http://localhost:5000/uploads/accommodations/${img}`;
        }
        return '/images/default-accommodation.jpg';
    };

    if (accommodations.length === 0) {
        return (
            <div className="PopularAccommodations">
                <div className="no-accommodations">
                    <p>No featured accommodations available</p>
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
                    {accommodations.map(acc => (
                        <div
                            className="card"
                            key={acc._id}
                            onClick={() => navigate(`/accommodation/${acc._id}`)}
                        >
                            <img
                                src={getImageUrl(acc)}
                                className="image"
                                loading="lazy"
                                onError={e => e.target.src = "/images/default-accommodation.jpg"}
                            />

                            <div className="property-badge">{acc.accommodation_type}</div>

                            <button
                                className={`save-button ${savedAccommodations.includes(acc._id) ? 'saved' : ''}`}
                                onClick={(e) => toggleSaveAccommodation(acc._id, acc.accommodation_name, e)}
                            >
                                {savedAccommodations.includes(acc._id)
                                    ? <FaHeart className="icon-heart-filled" />
                                    : <FaRegHeart className="icon-heart-outline" />}
                            </button>

                            <div className="accommodation-info">
                                <h3>{acc.accommodation_name}</h3>
                                <p className="location">{acc.address}</p>
                                <p className="property-type">
                                    {acc.property_type} • {acc.bedrooms} bed • {acc.bathrooms} bath
                                </p>

                                <div className="rating-container">
                                    <StarRating rating={acc.averageRating} />
                                    <span className="rating-text">
                                        {acc.averageRating.toFixed(1)} ({acc.totalReviews} reviews)
                                    </span>
                                </div>

                                <div className="price-action">
                                    <p className="price">
                                        Rs {acc.price_per_month?.toLocaleString()}/= per month
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/accommodation/${acc._id}`);
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
                    onClick={() => navigate('/accommodation')}
                >
                    View All Accommodations <FaArrowRight className="arrow-icon" />
                </button>
            </section>
        </div>
    );
};

export default PopularAccommodations;