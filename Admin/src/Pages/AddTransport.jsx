import React, { useState } from 'react';
import { assets } from '../Assets/assets';
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

  return (
    <div className="dashboard-container">
      <form>
        <div className="dashboard-title">Add Transport</div>

        {/* ------------ Uploading Image ------------ */}
        <p className='section-title'>Vehicle Image</p>
        <div className="image-upload">
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
        <div className='input-grid'>

          {/* Vehicle Type */}
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

          {/* Vehicle Name */}
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

          {/* Registration Number */}
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

          {/* Passenger Capacity */}
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

          {/* Price Per Km */}
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

          {/* City */}
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

          {/* Contact Number */}
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

        {/* Amenities */}
        <div className="amenities-section">
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
        </div>

        {/* ------------ Submit Button ------------ */}
        <button className='submit-button'>Add Transport</button>
      </form>
    </div>
  );
};

export default AddTransport;