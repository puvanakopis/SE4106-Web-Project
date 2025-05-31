import React, { useState, useEffect } from 'react';
import { assets, transportData } from '../Assets/assets';
import './AddTransport.css';

const AddTransport = () => {
  const [image, setImage] = useState(null);
  const [inputs, setInputs] = useState({
    vehicleType: '',
    vehicleName: '',
    registrationNumber: '',
    capacity: '',
    pricePerKm: '',
    city: '',
    contact: '',
    amenities: {
      "Air Conditioning": false,
      "Wi-Fi": false,
      "Music System": false,
      "GPS Navigation": false,
      "Extra Luggage Space": false,
    }
  });

  // Calculate transport statistics from transportData
  const transportStats = {
    totalVehicles: transportData.length,
    availableVehicles: transportData.filter(v => v.isAvailable).length,
    bookedVehicles: transportData.filter(v => !v.isAvailable).length,
    averagePrice: transportData.reduce((sum, v) => sum + v.pricePerKm, 0) / transportData.length || 0
  };

  // Scroll animation
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
        <div className="dashboard-title ScrollingAnimation">Add Transport</div>

        {/* ------------ Transport Statistics Summary ------------ */}
        <div className="dashboard-summary ScrollingAnimation">
          {/* Total Vehicles */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Total Vehicles Icon" className="icon" />
            <div>
              <p className="summary-title">Total Vehicles</p>
              <p className="summary-value">{transportStats.totalVehicles}</p>
            </div>
          </div>

          {/* Available Vehicles */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Available Vehicles Icon" className="icon" />
            <div>
              <p className="summary-title">Available</p>
              <p className="summary-value">{transportStats.availableVehicles}</p>
            </div>
          </div>

          {/* Booked Vehicles */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Booked Vehicles Icon" className="icon" />
            <div>
              <p className="summary-title">Booked</p>
              <p className="summary-value">{transportStats.bookedVehicles}</p>
            </div>
          </div>

          {/* Average Price */}
          <div className="summary-box">
            <img src={assets.totalRevenueIcon} alt="Average Price Icon" className="icon" />
            <div>
              <p className="summary-title">Avg. Price/Km</p>
              <p className="summary-value">LKR {transportStats.averagePrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* ------------ Uploading Image ------------ */}
        <p className='section-title ScrollingAnimation'>Vehicle Image</p>
        <div className="image-upload ScrollingAnimation">
          <label htmlFor="transportImage">
            <img
              className='upload-image'
              src={image ? URL.createObjectURL(image) : assets.uploadArea}
              alt=''
            />
            <input
              type="file"
              accept='image/*'
              id="transportImage"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* ------------ Transport Info Inputs ------------ */}
        <div className='input-grid ScrollingAnimation'>
          <div className="input-group">
            <p className="label-text">Vehicle Type</p>
            <select
              value={inputs.vehicleType}
              onChange={(e) => setInputs({ ...inputs, vehicleType: e.target.value })}
              className='input-select'
            >
              <option value="">Select Vehicle Type</option>
              <option value="Bus">Bus</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
              <option value="Motorbike">Motorbike</option>
            </select>
          </div>

          <div className="input-group">
            <p className='label-text'>Vehicle Name</p>
            <input
              type="text"
              placeholder='e.g. Toyota Hiace'
              className='input-box'
              value={inputs.vehicleName}
              onChange={(e) => setInputs({ ...inputs, vehicleName: e.target.value })}
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Registration Number</p>
            <input
              type="text"
              placeholder='e.g. NP-AB-1234'
              className='input-box'
              value={inputs.registrationNumber}
              onChange={(e) => setInputs({ ...inputs, registrationNumber: e.target.value })}
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Passenger Capacity</p>
            <input
              type="number"
              placeholder='0'
              className='input-box'
              value={inputs.capacity}
              onChange={(e) => setInputs({ ...inputs, capacity: e.target.value })}
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Price Per Km (LKR)</p>
            <input
              type="number"
              placeholder='0'
              className='input-box'
              value={inputs.pricePerKm}
              onChange={(e) => setInputs({ ...inputs, pricePerKm: e.target.value })}
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Operating City</p>
            <select
              value={inputs.city}
              onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
              className='input-select'
            >
              <option value="">Select City</option>
              <option value="Pambahinna">Pambahinna</option>
              <option value="Belihuloya">Belihuloya</option>
              <option value="Kumbalgamuwa">Kumbalgamuwa</option>
            </select>
          </div>

          <div className="input-group">
            <p className='label-text'>Contact Number</p>
            <input
              type="tel"
              placeholder='+94 77 123 4567'
              className='input-box'
              value={inputs.contact}
              onChange={(e) => setInputs({ ...inputs, contact: e.target.value })}
            />
          </div>
        </div>

        {/* ------------ Amenities ------------ */}
        <div className="amenities-section ScrollingAnimation">
          <p className='section-title'>Amenities</p>
          <div className='amenities-list'>
            {Object.keys(inputs.amenities).map((amenity, index) => (
              <div key={index} className="amenity-item">
                <input
                  type="checkbox"
                  id={`amenities${index + 1}`}
                  checked={inputs.amenities[amenity]}
                  onChange={() =>
                    setInputs({
                      ...inputs,
                      amenities: {
                        ...inputs.amenities,
                        [amenity]: !inputs.amenities[amenity]
                      }
                    })
                  }
                />
                <label htmlFor={`amenities${index + 1}`}>{amenity}</label>
              </div>
            ))}
          </div>
        </div>

        {/* ------------ Submit Button ------------ */}
        <button className='submit-button ScrollingAnimation'>Add Transport</button>
      </form>
    </div>
  );
};

export default AddTransport;
