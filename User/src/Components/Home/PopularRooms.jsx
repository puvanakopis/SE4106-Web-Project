import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsDummyData } from '../../Assets/assets';
import { FaArrowRight, FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import { scrollToTop } from '../../Pages/scrollToTop';
import { useInView } from 'react-intersection-observer';
import './PopularRooms.css';

const PopularRooms = () => {
    const navigate = useNavigate();
    const [savedRooms, setSavedRooms] = useState(() => {
        const saved = localStorage.getItem('savedRooms');
        return saved ? JSON.parse(saved) : [];
    });
    const [showSavedNotification, setShowSavedNotification] = useState(false);

    // Modified intersection observers without triggerOnce
    const [headerRef, headerInView] = useInView({
        threshold: 0.1
    });

    const [gridRef, gridInView] = useInView({
        threshold: 0.1
    });

    const [buttonRef, buttonInView] = useInView({
        threshold: 0.1
    });

    const toggleSaveRoom = (roomId, e) => {
        e.stopPropagation();
        setSavedRooms((prev) => {
            const isSaved = prev.includes(roomId);
            const newSaved = isSaved
                ? prev.filter((id) => id !== roomId)
                : [...prev, roomId];
            localStorage.setItem('savedRooms', JSON.stringify(newSaved));

            if (!isSaved) {
                setShowSavedNotification(true);
            }

            return newSaved;
        });
    };

    useEffect(() => {
        if (showSavedNotification) {
            const timer = setTimeout(() => {
                setShowSavedNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showSavedNotification]);

    return (
        <div className="PopularRooms">
            {/* Save Notification */}
            {showSavedNotification && (
                <div className="save-notification">
                    <div className="notification-content">
                        <FaHeart className="notification-icon" />
                        <span>Room saved</span>
                    </div>
                    <button
                        className="notification-close"
                        onClick={() => setShowSavedNotification(false)}
                        aria-label="Close notification"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            <section className="featured-properties">
                <div className={`section-header ${headerInView ? 'slide-in-left' : ''}`} ref={headerRef}>
                    <h2>Featured Accommodations</h2>
                    <p>Top-rated stays selected by our travel experts</p>
                </div>

                <div className={`properties-grid ${gridInView ? 'slide-in-right' : ''}`} ref={gridRef}>
                    {roomsDummyData.slice(0, 3).map(room => (
                        <div
                            className="card"
                            key={room._id}
                            onClick={() => {
                                navigate(`/room/${room._id}`)
                                scrollToTop()
                            }}
                        >
                            <img
                                src={room.images[0]}
                                alt={`${room.roomType} in ${room.hotel.name}`}
                                className="image"
                                loading="lazy"
                            />
                            <div className="property-badge">{room.roomType}</div>
                            <button
                                className={`save-button ${savedRooms.includes(room._id) ? 'saved' : ''}`}
                                onClick={(e) => toggleSaveRoom(room._id, e)}
                                aria-label={savedRooms.includes(room._id) ? 'Remove from saved' : 'Save this room'}
                            >
                                {savedRooms.includes(room._id) ? (
                                    <FaHeart className="icon-heart-filled" />
                                ) : (
                                    <FaRegHeart className="icon-heart-outline" />
                                )}
                            </button>
                            <div className="room-info">
                                <h3>{room.roomType} at {room.hotel.name}</h3>
                                <p>Location – {room.hotel.city}</p>
                                <div className="rating">
                                    <span>{room.rating}</span>
                                </div>
                                <div className="price-action">
                                    <p>Rs {room.pricePerMonth.toLocaleString()}/= per month</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/room/${room._id}`);
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
                    className={`view-all-button ${buttonInView ? 'slide-in-bottom' : ''}`}
                    onClick={() => {
                        navigate('/accommodation')
                        scrollToTop()
                    }}
                    ref={buttonRef}
                >
                    View All Accommodations <FaArrowRight className="arrow-icon" />
                </button>
            </section>
        </div>
    );
};

export default PopularRooms;