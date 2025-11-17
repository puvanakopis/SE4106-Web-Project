import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PopularTransport.css';

const PopularTransport = ({ setLoading }) => {
    const navigate = useNavigate();
    const [transports, setTransports] = useState([]);
    const [savedTransports, setSavedTransports] = useState(() => {
        const saved = localStorage.getItem('savedTransports');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchTopRatedTransports = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:5000/api/transports?limit=3&sort_by=averageRating&sort_order=desc`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch transports');
                }

                const data = await response.json();

                if (data.success) {
                    const topRated = data.transports
                        .filter(t => t.averageRating > 0)
                        .slice(0, 3);

                    setTransports(topRated);
                }
            } catch (err) {
                console.error('Error fetching transports:', err);
                toast.error('Failed to load featured transport options');
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedTransports();
    }, []);

    const toggleSaveTransport = (transportId, transportName, e) => {
        e.stopPropagation();

        setSavedTransports(prev => {
            const isSaved = prev.includes(transportId);
            const updated = isSaved
                ? prev.filter(id => id !== transportId)
                : [...prev, transportId];

            localStorage.setItem('savedTransports', JSON.stringify(updated));

            toast.success(
                isSaved
                    ? `Removed ${transportName} from saved`
                    : `Saved ${transportName} to favorites`
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

    const getImageUrl = (transport) => {
        if (transport.vehicle_images?.length > 0) {
            const img = transport.vehicle_images[0];
            if (img.startsWith('http')) return img;
            if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
            return `http://localhost:5000/uploads/transports/${img}`;
        }
        return '/images/default-vehicle.jpg';
    };

    if (transports.length === 0) {
        return (
            <div className="PopularTransport">
                <div className="no-transports">
                    <p>No featured transport options available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="PopularTransport">
            <section className="featured-transport">
                <div className="section-header">
                    <h2>Featured Transport Options</h2>
                    <p>Top-rated vehicles selected by our travel experts</p>
                </div>

                <div className="transport-grid">
                    {transports.map(transport => (
                        <div
                            className="card"
                            key={transport._id}
                            onClick={() => navigate(`/transport/${transport._id}`)}
                        >
                            <img
                                src={getImageUrl(transport)}
                                alt={`${transport.brand} ${transport.model}`}
                                className="image"
                                loading="lazy"
                                onError={e => e.target.src = '/images/default-vehicle.jpg'}
                            />

                            <div className="transport-badge">{transport.vehicle_type}</div>

                            <button
                                className={`save-button ${savedTransports.includes(transport._id) ? 'saved' : ''}`}
                                onClick={(e) =>
                                    toggleSaveTransport(transport._id, `${transport.brand} ${transport.model}`, e)
                                }
                            >
                                {savedTransports.includes(transport._id)
                                    ? <FaHeart className="icon-heart-filled" />
                                    : <FaRegHeart className="icon-heart-outline" />}
                            </button>

                            <div className="transport-info">
                                <h3>{transport.brand} {transport.model}</h3>
                                <p className="location">{transport.address}</p>
                                <p className="vehicle-details">
                                    {transport.vehicle_type} • {transport.fuel_type} • {transport.year}
                                </p>

                                <div className="rating-container">
                                    <StarRating rating={transport.averageRating} />
                                    <span className="rating-text">
                                        {transport.averageRating.toFixed(1)} ({transport.totalReviews} reviews)
                                    </span>
                                </div>

                                <div className="price-action">
                                    <p className="price">
                                        Rs {transport.rental_price_per_day?.toLocaleString()}/= per day
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/transport/${transport._id}`);
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
                    onClick={() => navigate('/transport')}
                >
                    View All Transport Options <FaArrowRight className="arrow-icon" />
                </button>
            </section>
        </div>
    );
};

export default PopularTransport;