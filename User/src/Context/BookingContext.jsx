import { createContext, useState, useContext, useEffect } from 'react';
import { upcomingBookings, pastBookings } from '../Assets/assets';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState({
    roomBookings: [],
    vehicleBookings: []
  });

  // Load initial bookings from data files
  useEffect(() => {
    const initialBookings = {
      roomBookings: [...upcomingBookings.roomBookings, ...pastBookings.roomBookings],
      vehicleBookings: [...upcomingBookings.vehicleBookings, ...pastBookings.vehicleBookings]
    };
    
    setBookings(initialBookings);
    localStorage.setItem('bookings', JSON.stringify(initialBookings));
  }, []);

  const loadBookings = () => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  };

  const saveBookings = (updatedBookings) => {
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const addRoomBooking = (newBooking) => {
    const updatedBookings = {
      ...bookings,
      roomBookings: [...bookings.roomBookings, newBooking]
    };
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const addVehicleBooking = (newBooking) => {
    const updatedBookings = {
      ...bookings,
      vehicleBookings: [...bookings.vehicleBookings, newBooking]
    };
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const updateBookingStatus = (bookingId, type, status, feedbackData = null) => {
    const bookingArray = type === 'room' ? 'roomBookings' : 'vehicleBookings';
    const bookingIndex = bookings[bookingArray].findIndex(b => b._id === bookingId);
    if (bookingIndex === -1) return;

    const bookingToUpdate = bookings[bookingArray][bookingIndex];
    const updatedBooking = {
      ...bookingToUpdate,
      booking_status: status,
      ...(feedbackData && {
        rating: feedbackData.rating,
        feedback: feedbackData.feedback
      })
    };

    const updatedBookings = {
      ...bookings,
      [bookingArray]: [
        ...bookings[bookingArray].slice(0, bookingIndex),
        updatedBooking,
        ...bookings[bookingArray].slice(bookingIndex + 1)
      ]
    };

    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const getBookingById = (bookingId, type) => {
    const bookingArray = type === 'room' ? 'roomBookings' : 'vehicleBookings';
    return bookings[bookingArray].find(booking => booking._id === bookingId);
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addRoomBooking,
      addVehicleBooking,
      updateBookingStatus,
      loadBookings,
      getBookingById
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);