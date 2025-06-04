import React, { useState, useEffect } from 'react';
import { assets } from '../Assets/assets';
import './AddRoom.css';

const AddRoom = () => {
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  });

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerMonth: '',
    amenities: {
      "Free Wifi": false,
      "Shared Kitchen": false,
      "Study Desk with Chair": false,
      "Private Bathroom": false,
      "Cleaning Services": false,
    }
  });

  const roomStats = {
    totalRooms: 24,
    occupiedRooms: 18,
    availableRooms: 6,
    averagePrice: 12500
  };

  // Scroll Animation Effect
  useEffect(() => {
    const elements = document.querySelectorAll('.ScrollingAnimation');

    const handleScroll = () => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          el.classList.add('show');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dashboard-container">
      <form>
        <div className="dashboard-title ScrollingAnimation">Add Room</div>

        {/* ------------ Room Statistics Summary ------------ */}
        <div className="dashboard-summary ScrollingAnimation">
          {/* Total Rooms */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Total Rooms Icon" className="icon" />
            <div>
              <p className="summary-title">Total Rooms</p>
              <p className="summary-value">{roomStats.totalRooms}</p>
            </div>
          </div>

          {/* Occupied Rooms */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Occupied Rooms Icon" className="icon" />
            <div>
              <p className="summary-title">Occupied Rooms</p>
              <p className="summary-value">{roomStats.occupiedRooms}</p>
            </div>
          </div>

          {/* Available Rooms */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Available Rooms Icon" className="icon" />
            <div>
              <p className="summary-title">Available Rooms</p>
              <p className="summary-value">{roomStats.availableRooms}</p>
            </div>
          </div>

          {/* Average Price */}
          <div className="summary-box">
            <img src={assets.totalRevenueIcon} alt="Average Price Icon" className="icon" />
            <div>
              <p className="summary-title">Average Price</p>
              <p className="summary-value">Rs {roomStats.averagePrice}.00</p>
            </div>
          </div>
        </div>

        {/* ------------ Uploading Images ------------ */}
        <p className='section-title ScrollingAnimation'>Images</p>
        <div className="image-upload-grid ScrollingAnimation">
          {Object.keys(images).map((key) => (
            <label htmlFor={`roomImage${key}`} key={key}>
              <img
                className='upload-image'
                src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
                alt=''
              />
              <input
                type="file"
                accept='image/*'
                id={`roomImage${key}`}
                hidden
                onChange={(e) =>
                  setImages({ ...images, [key]: e.target.files[0] })
                }
              />
            </label>
          ))}
        </div>

        {/* ------------ Room Info Inputs ------------ */}
        <div className='input-flex ScrollingAnimation'>
          {/* Room Type */}
          <div className="input-group">
            <p className="label-text">Room Type</p>
            <select
              value={inputs.roomType}
              onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
              className='input-select'
            >
              <option value="">Select Room Type</option>
              <option value="Single Room">Single Room</option>
              <option value="Shared Room">Shared Room</option>
            </select>
          </div>

          {/* Price Per Month */}
          <div className="input-group">
            <p className='label-text'>
              Price <span className='text-xs'>/Month</span>
            </p>
            <input
              type="number"
              placeholder='0'
              className='input-box'
              value={inputs.pricePerMonth}
              onChange={(e) => setInputs({ ...inputs, pricePerMonth: e.target.value })}
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="amenities-section ScrollingAnimation">
          <p className='section-title'>Amenities</p>
          <div className='amenities-list'>
            {Object.keys(inputs.amenities).map((amenity, index) => (
              <div key={index} className="amenity-item">
                <input
                  type="checkbox"
                  id={`amenities${index + 1}`}
                  checked={inputs.amenities[amenity]}
                  onChange={() => setInputs({
                    ...inputs,
                    amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] },
                  })}
                />
                <label htmlFor={`amenities${index + 1}`}>{amenity}</label>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button className='submit-button'>Add Room</button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
