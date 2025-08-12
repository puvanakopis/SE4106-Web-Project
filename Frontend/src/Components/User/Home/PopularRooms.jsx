import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsData } from '../../../Assets/assets';
import { FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import { scrollToTop } from '../../../Pages/scrollToTop';
import StarRating from '../../Rating/StarRating';
import './PopularRooms.css';

const PopularRooms = () => {
    const navigate = useNavigate();
    const [savedRooms, setSavedRooms] = useState(() => {
        const saved = localStorage.getItem('savedRooms');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleSaveRoom = (roomId, e) => {
        e.stopPropagation();
        setSavedRooms((prev) => {
            const isSaved = prev.includes(roomId);
            const newSaved = isSaved
                ? prev.filter((id) => id !== roomId)
                : [...prev, roomId];
            localStorage.setItem('savedRooms', JSON.stringify(newSaved));
            return newSaved;
        });
    };

    return (
        <div className="PopularRooms">
            <section className="featured-properties">
                <div className="section-header">
                    <h2>Featured Accommodations</h2>
                    <p>Top-rated stays selected by our travel experts</p>
                </div>

                <div className="properties-grid">
                    {roomsData.slice(0, 3).map(room => (
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
                                alt={`${room.roomName}`}
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
                                <h3>{room.roomType}</h3>
                                <p>Location – {room.location}</p>

                                <div className="rating-container">
                                    <StarRating rating={room.averageRating} />
                                    <span className="rating-text">
                                        {room.averageRating.toFixed(1)} ({room.totalReviews} reviews)
                                    </span>
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
                    className="view-all-button"
                    onClick={() => {
                        navigate('/accommodation')
                        scrollToTop()
                    }}
                >
                    View All Accommodations <FaArrowRight className="arrow-icon" />
                </button>
            </section>
        </div>
    );
};

export default PopularRooms;