import React, { useState } from 'react';
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

  return (
    <div className="dashboard-container">
      <form>
        <div className="dashboard-title">Add Room</div>

        {/* ------------ Uploading Images ------------ */}
        <p className='section-title'>Images</p>
        <div className="image-upload-grid">
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
        <div className='input-flex'>

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

        {/* Amenities  */}
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


        {/* ------------ Submit Button ------------ */}
          <button className='submit-button'>Add Room</button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
