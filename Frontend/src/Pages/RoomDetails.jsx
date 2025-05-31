import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { roomsDummyData, assets, facilityIcons, roomCommonData } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';
import GoogleMapEmbed from '../Components/GoogleMap/GoogleMap';

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

  return room && (
    <div className=' md:py-5 px-4 md:px-16 lg:px-24 xl:px-32 font-sans'>

      {/* Room Title */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-serif'>
          {room.hotel.name} <span className='font-inter text-sm'>({room.roomType})</span>
        </h1>
        <p className='text-xs font-semibold font-inter py-1.5 px-3 text-white bg-blue-500 rounded-full shadow-sm tracking-wide'>20% OFF</p>
      </div>

      {/* Room Rating */}
      <div className='flex items-center gap-1 mt-2'>
        <StarRating />
        <p className='ml-2 text-sm text-gray-600'>200+ reviews</p>
      </div>

      {/* Room Address */}
      <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
        <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
        <span>{room.hotel.address}</span>
      </div>

      {/* Room Images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img
            src={mainImage}
            alt="room-main"
            className='w-full rounded-xl shadow-lg object-cover max-h-[500px]'
          />
        </div>
        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {room.images.length > 1 &&
            room.images.map((image, index) => (
              <img
                onClick={() => setMainImage(image)}
                key={`${image}-${index}`}
                src={image}
                alt="room-thumbnail"
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer transition-all duration-200 hover:scale-105 ${
                  mainImage === image ? 'outline outline-4 outline-blue-500' : ''
                }`}
                loading="lazy"
              />
            ))}
        </div>
      </div>

      {/* Room Highlights */}
      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl font-serif'>Experience Luxury Like Never Before</h1>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {room.amenities.map((item, index) => (
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 shadow-sm'>
                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                <p className='text-sm text-gray-700'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className='text-2xl font-semibold text-orange-600 mt-4 md:mt-0'>{`Rs ${room.pricePerMonth} / month`}</p>
      </div>

      <div className="mt-24 flex flex-col md:flex-row gap-8">
        {/* Common Specifications */}
        <div className="flex-1 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img src={spec.icon} alt={`${spec.title}-icon`} className="w-[26px] h-[26px]" />
              <div>
                <p className="text-base font-semibold">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="flex-1">
          <GoogleMapEmbed />
        </div>
      </div>

      {/* Description */}
      <div className='max-w-3xl border-y border-gray-300 my-10 py-10 text-gray-600 leading-relaxed tracking-wide text-justify'>
        <p>
          {room.description || 'No description provided yet. Please check back later for more information.'}
        </p>
      </div>


      {/* Hosted By */}
      <div className='flex flex-col items-start gap-4'>
        <div className='flex gap-4'>
          <img src={assets.hostIcon} alt="host" className='h-14 w-14 md:h-10 md:w-10 rounded-full' />
          <div>
            <p className='text-lg md:text-xl font-semibold'>Hosted by {room.hotel.name}</p>
            <div className='flex items-center'>
              <StarRating />
              <p className='ml-2 text-sm text-gray-600'>200+ reviews</p>
            </div>
          </div>
        </div>
        <button className='px-6 py-2.5 mt-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 font-medium shadow hover:shadow-lg active:scale-95'>
          Book Now
        </button>
      </div>

    </div>
  );
};

export default RoomDetails;