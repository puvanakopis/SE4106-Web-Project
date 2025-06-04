import React, { useState } from 'react'
import Title from '../Components/Title/Title'
import { assets, userBookingsDummyData } from '../Assets/assets'

const MyBookings = () => {
    const [bookings, setBookings] = useState(userBookingsDummyData)

    return (
        <div>
            <Title 
                title='My Accommodation Bookings' 
                subTitle='Manage all your university housing reservations in one place. Track current stays and upcoming bookings for Sabaragamuwa University.' 
                align='left'
            />
            <div className='max-w-6xl mt-8 w-full text-gray-800'>
                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                    <div className='w-1/3'>Accommodation</div>
                    <div className='w-1/3'>Date & Duration</div>
                    <div className='w-1/3'>Payment</div>
                </div>  

                {bookings.map((booking)=>(
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                        {/* {Accommodation Details} */}
                        <div className='flex flex-col md:flex-row'>
                            <img src={booking.room.images[0]} alt="accommodation-img" className='md:w-44 rounded shadow object-cover' />
                            <div className='flex flex-col gap-1.5 max-md:mt-3 md:ml-4'>
                                <p className='font-playfair text-2xl'>{booking.hotel.name}
                                <span className='font-inter text-sm'>({booking.room.roomType})</span>
                                </p>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.locationIcon} alt="location-icon" /> 
                                    <span>{booking.hotel.address}, Belihuloya</span> 
                                </div>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.guestsIcon} alt="guest-icon" /> 
                                    <span>Roommates: {booking.guests}</span> 
                                </div>
                                <p className='text-base'>Monthly Rent: Rs.{booking.totalPrice}</p>
                            </div>
                        </div>
                        {/* {Date & Duration} */}
                        <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                            <div>
                                <p>Move-In Date:</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(booking.checkInDate).toDateString()}
                                </p>
                            </div> 
                            <div>
                                <p>Move-Out Date:</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(booking.checkOutDate).toDateString()}
                                </p>
                            </div> 
                        </div>
                        {/* {Payment Status} */}
                        <div className='flex flex-col items-start justify-center pt-3'>
                            <div className='flex items-center gap-2'>
                                <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                                <p className={`text-sm rounded-full ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                                    {booking.isPaid ? "Paid" : "Pending"}
                                </p>
                            </div>
                            {!booking.isPaid && (
                                <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                                    Pay Rent
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings