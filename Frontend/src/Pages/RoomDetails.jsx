import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { roomsDummyData, assets, facilityIcons, roomCommonData } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';
import GoogleMapEmbed from '../Components/GoogleMap/GoogleMap';
import './RoomDetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const foundRoom = roomsDummyData.find(room => room._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.images[0]);
    }
  }, [id]);

  if (!room) return <div className="room-details">Loading room details...</div>;


      {/* Room Title */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-serif'>
          {room.hotel.name} <span className='font-inter text-sm'>({room.roomType})</span>
        </h1>
        <p className='text-xs font-semibold font-inter py-1.5 px-3 text-white bg-blue-500 rounded-full shadow-sm tracking-wide'>20% OFF</p>

  return (
    <div className="room-details">
      {/* Room Title Section */}
      <div className="room-title-section">
        <h3 className="room-main-title">
          {room.hotel.name} <span className="room-type-badge">{room.roomType}</span>
        </h3>
      </div>

      {/* Rating and Location */}
      <div className="room-rating-section">
        <StarRating rating={room.rating} />
        <span className="reviews-count">200+ reviews</span>
      </div>
      <div className="room-location">
        <img src={assets.locationIcon} alt="Location icon" />
        <span>{room.hotel.address}</span>
      </div>

      {/* Image Gallery */}
      <div className="room-gallery">
        <div className="main-image-container">
          <img
            src={mainImage}
            alt="Main room view"
            className="main-image"
          />
        </div>
        <div className="thumbnail-grid">
          {room.images?.length > 1 &&
            room.images.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt="room-thumbnail"
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer transition-all duration-200 hover:scale-105 ${
                  mainImage === image ? 'outline outline-4 outline-blue-500' : ''
                }`}

                alt={`Room view ${index + 1}`}
                className={`thumbnail ${mainImage === image ? 'selected-thumbnail' : ''}`}
                onClick={() => setMainImage(image)}
                loading="lazy"
              />
            ))}
        </div>
      </div>

      {/* Highlights Section */}
      <div className="highlights-section">
        <div>
          <h2 className="highlights-title">Student PG Accommodation
</h2>
          <div className="amenities-list">
            {room.amenities?.map((item, index) => (
              <div key={index} className="amenity-item">
                <img src={facilityIcons[item]} alt={item} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="price-display">Rs {room.pricePerMonth} / month</div>
      </div>

      {/* Specifications and Map */}
      <div className="details-container">
        <div className="specifications-section">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="spec-item">
              <img src={spec.icon} alt={`${spec.title} icon`} className="spec-icon" />
              <div className="spec-content">
                <h3>{spec.title}</h3>
                <p>{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="map-container">
          <GoogleMapEmbed />
        </div>
      </div>

      {/* Description */}
      <div className="description-section">
        <p className="description-text">
          {room.description || 'No description provided yet. Please check back later for more information.'}
        </p>
      </div>

      {/* Host Section */}
      <div className="host-section">
        <div className="host-info">
          <img src={assets.hostIcon} alt="Host" className="host-avatar" />
          <div>
            <h3 className="host-name">Hosted by {room.hotel.name}</h3>
            <div className="room-rating-section">
              <StarRating rating={room.rating} />
              <span className="reviews-count">200+ reviews</span>
            </div>
          </div>
        </div>

        <button className='px-6 py-2.5 mt-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 font-medium shadow hover:shadow-lg active:scale-95'>
          Book Now
        </button>

        <button className="contact-button">Contact Now</button>
      </div>
    </div>
  );
};

export default RoomDetails;