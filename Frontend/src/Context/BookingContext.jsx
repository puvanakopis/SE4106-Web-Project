import { createContext, useState, useContext, useEffect } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: []
  });

  // Load bookings from localStorage on initial render
  useEffect(() => {
    loadBookings();
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

  const addBooking = (newBooking) => {
    const updatedBookings = {
      ...bookings,
      upcoming: [...bookings.upcoming, newBooking]
    };
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const cancelBooking = (bookingId) => {
    const updatedBookings = {
      ...bookings,
      upcoming: bookings.upcoming.filter(booking => booking.id !== bookingId)
    };
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const completeBooking = (bookingId, rating, feedback) => {
    // Find the booking to complete
    const bookingToComplete = bookings.upcoming.find(b => b.id === bookingId);
    
    if (!bookingToComplete) return;

    // Create the completed booking with feedback
    const completedBooking = {
      ...bookingToComplete,
      status: 'completed',
      feedback: {
        rating,
        comment: feedback,
        date: new Date().toISOString()
      }
    };

    // Update the bookings state
    const updatedBookings = {
      upcoming: bookings.upcoming.filter(b => b.id !== bookingId),
      past: [...bookings.past, completedBooking]
    };

    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const getBookingById = (bookingId) => {
    const allBookings = [...bookings.upcoming, ...bookings.past];
    return allBookings.find(booking => booking.id === bookingId);
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      cancelBooking,
      completeBooking,
      loadBookings,
      getBookingById
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);