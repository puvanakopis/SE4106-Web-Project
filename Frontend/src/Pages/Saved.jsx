import React, { useState } from 'react';
import Title from '../Components/Title/Title';
import { assets, userBookingsDummyData } from '../Assets/assets';

const Saved = () => {
    const [bookings, setBookings] = useState(userBookingsDummyData);

    return (
        <div className="px-4 md:px-12 py-6">
            <Title
                title="My Bookings"
                subTitle="Easily manage your past, current, and upcoming room reservations in one place. Plan your accommodation seamlessly with just a few clicks."
                align="left"
            />

            <div className="max-w-6xl w-full mt-8 text-gray-800 mx-auto">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-semibold text-base py-3 px-2 text-gray-600 uppercase tracking-wide">
                    <div>Hotels</div>
                    <div>Date & Timings</div>
                    <div>Payment</div>
                </div>

                {bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-200 py-6 px-2 gap-y-6 hover:bg-gray-50 rounded-lg transition duration-200"
                    >
                        {/* Hotel Details */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <img
                                src={booking.room.images[0]}
                                alt="hotel-img"
                                className="md:w-44 w-full max-h-40 object-cover rounded-xl shadow-sm"
                            />
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h3 className="font-playfair text-xl font-semibold mb-1">
                                        {booking.room.name}{' '}
                                        <span className="font-inter text-sm text-gray-500">
                                            ({booking.room.roomType})
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <img
                                            src={assets.locationIcon}
                                            alt="location-icon"
                                            className="w-4 h-4"
                                        />
                                        <span>{booking.room.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <img
                                            src={assets.guestsIcon}
                                            alt="guest-icon"
                                            className="w-4 h-4"
                                        />
                                        <span>Guests: {booking.guests}</span>
                                    </div>
                                </div>
                                <p className="text-base font-medium mt-2 text-gray-700">
                                    Total: <span className="text-indigo-600">Rs {booking.totalPrice}</span>
                                </p>
                            </div>
                        </div>

                        {/* Date & Timings */}
                        <div className="flex flex-row md:flex-col gap-4 md:justify-center text-sm text-gray-600">
                            <div>
                                <p className="font-medium text-gray-700">Check-In:</p>
                                <p>{new Date(booking.checkInDate).toDateString()}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Check-Out:</p>
                                <p>{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="flex flex-col justify-center items-start gap-3">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-3 w-3 rounded-full ${
                                        booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                ></div>
                                <span
                                    className={`text-sm font-medium ${
                                        booking.isPaid ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {booking.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                            </div>
                            {!booking.isPaid && (
                                <button className="text-xs px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm">
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Saved;
