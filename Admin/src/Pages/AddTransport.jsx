import React, { useState, useEffect } from 'react';
import { assets, ownerData, vehicleData as initialVehicleData, vehicleBookingsData } from "../Assets/assets";


import './AddTransport.css';

const AddTransport = () => {

  const [vehicleData] = useState(initialVehicleData);


  // State to hold Transport details
  const [image, setImage] = useState(null);
  const [inputs, setInputs] = useState({
    owner_id: '',
    vehicle_type: '',
    brand: '',
    model: '',
    registration_number: '',
    seating_capacity: '',
    rental_price_per_day: '',
    city: '',
    contact: '',
    availability_status: true,
    amenities: {
      "Air Conditioning": false,
      "Wi-Fi": false,
      "Music System": false,
      "GPS Navigation": false,
      "Extra Luggage Space": false,
    }
  });



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



  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputs.owner_id) {
      alert("Please select an owner.");
      return;
    }

    // Find owner object by owner_id
    const ownerObj = ownerData[0].find(o => o.owner_id === inputs.owner_id);

    if (!ownerObj) {
      alert("Selected owner not found.");
      return;
    }

    // Build new vehicle object as per your data structure
    const newVehicle = {
      vehicle_id: `vehicle_${Date.now()}`,
      owner: ownerObj,
      vehicle_type: inputs.vehicle_type,
      brand: inputs.brand,
      model: inputs.model,
      fuel_type: "Unknown",
      seating_capacity: Number(inputs.seating_capacity),
      year: new Date().getFullYear(),
      registration_number: inputs.registration_number,
      rental_price_per_day: Number(inputs.rental_price_per_day),
      deposit_amount: 0,
      availability_status: inputs.availability_status,
      images: image ? [URL.createObjectURL(image)] : [],
      average_rating: 0,
      city: inputs.city,
      contact: inputs.contact,
      amenities: inputs.amenities,
    };


    // Alert new vehicle details
    console.log("New Vehicle Added:", newVehicle);
    alert("Vehicle added! Check console for details.");

    // Reset form if needed
    setInputs({
      owner_id: '',
      vehicle_type: '',
      brand: '',
      model: '',
      registration_number: '',
      seating_capacity: '',
      rental_price_per_day: '',
      city: '',
      contact: '',
      availability_status: true,
      amenities: {
        "Air Conditioning": false,
        "Wi-Fi": false,
        "Music System": false,
        "GPS Navigation": false,
        "Extra Luggage Space": false,
      }
    });
    setImage(null);
  };


  // Calculate summary statistics
  const totalVehicles = vehicleData.length;
  const availableVehicles = vehicleData.filter((v) => v.availability_status).length;
  const bookedVehicles = totalVehicles - availableVehicles;
  const totalBookings = vehicleBookingsData.length;



  return (
    <div className="dashboard-container">
      <form onSubmit={handleSubmit}>
        <div className="dashboard-title ScrollingAnimation">Add Transport</div>

        {/* ------------ Transport Statistics Summary ------------ */}
        <div className="dashboard-summary ScrollingAnimation">
          {/* Total Vehicles */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Total Vehicles Icon" className="icon" />
            <div>
              <p className="summary-title">Total Vehicles</p>
              <p className="summary-value">{totalVehicles}</p>
            </div>
          </div>

          {/* Available Vehicles */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Available Vehicles Icon" className="icon" />
            <div>
              <p className="summary-title">Available</p>
              <p className="summary-value">{availableVehicles}</p>
            </div>
          </div>

          {/* Booked Vehicles */}
          <div className="summary-box">
            <img src={assets.totalBookingIcon} alt="Booked Vehicles Icon" className="icon" />
            <div>
              <p className="summary-title">Booked</p>
              <p className="summary-value">{bookedVehicles}</p>
            </div>
          </div>

          {/* Average Price */}
          <div className="summary-box">
            <img src={assets.totalRevenueIcon} alt="Average Price Icon" className="icon" />
            <div>
              <p className="summary-title">Total Bookings</p>
              <p className="summary-value">{totalBookings}</p>
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
          {/* Owner Select */}
          <div className="input-group">
            <p className="label-text">Owner</p>
            <input
              type="text"
              placeholder='e.g. Toyota'
              className='input-box'
              value={inputs.brand}
              onChange={(e) => setInputs({ ...inputs, brand: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <p className="label-text">Vehicle Type</p>
            <select
              value={inputs.vehicle_type}
              onChange={(e) => setInputs({ ...inputs, vehicle_type: e.target.value })}
              className='input-select'
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="Bus">Bus</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
              <option value="Motorbike">Motorbike</option>
            </select>
          </div>

          <div className="input-group">
            <p className='label-text'>Brand</p>
            <input
              type="text"
              placeholder='e.g. Toyota'
              className='input-box'
              value={inputs.brand}
              onChange={(e) => setInputs({ ...inputs, brand: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Model</p>
            <input
              type="text"
              placeholder='e.g. Hiace'
              className='input-box'
              value={inputs.model}
              onChange={(e) => setInputs({ ...inputs, model: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Registration Number</p>
            <input
              type="text"
              placeholder='e.g. NP-AB-1234'
              className='input-box'
              value={inputs.registration_number}
              onChange={(e) => setInputs({ ...inputs, registration_number: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Passenger Capacity</p>
            <input
              type="number"
              placeholder='0'
              className='input-box'
              value={inputs.seating_capacity}
              onChange={(e) => setInputs({ ...inputs, seating_capacity: e.target.value })}
              required
              min={1}
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Price Per Day (LKR)</p>
            <input
              type="number"
              placeholder='0'
              className='input-box'
              value={inputs.rental_price_per_day}
              onChange={(e) => setInputs({ ...inputs, rental_price_per_day: e.target.value })}
              required
              min={0}
            />
          </div>

          <div className="input-group">
            <p className='label-text'>Operating City</p>
            <select
              value={inputs.city}
              onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
              className='input-select'
              required
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
              required
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
                        [amenity]: !inputs.amenities[amenity],
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
        <button type="submit" className='submit-button btn btn-primary ScrollingAnimation'>Add Transport</button>
      </form>
    </div>
  );
};

export default AddTransport;
