import { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: []
  });

  const addBooking = (newBooking) => {
    setBookings(prev => ({
      ...prev,
      upcoming: [...prev.upcoming, newBooking]
    }));
    // Save to localStorage
    localStorage.setItem('bookings', JSON.stringify({
      ...bookings,
      upcoming: [...bookings.upcoming, newBooking]
    }));
  };

  // Load bookings from localStorage on initial render
  const loadBookings = () => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, loadBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);