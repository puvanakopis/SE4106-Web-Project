import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { assets } from '../../Assets/assets';
import { AuthContext } from '../../Context/AuthContext';
import StarRating from '../../Components/Rating/StarRating';
import GoogleMapEmbed from '../../Components/GoogleMap/GoogleMap';
import PaymentPopup from '../../Components/PaymentPopup/PaymentPopup';
import OwnerDetails from './OwnerDetails';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccommodationDetails.css';

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, token } = useContext(AuthContext);

  const [accommodation, setAccommodation] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalMonths, setTotalMonths] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  // Fixed image URL function
  const processAccommodationImages = (images) => {
    if (!images || !Array.isArray(images)) {
      return [assets.defaultAccommodationImage];
    }

    return images.map(image => {
      if (!image) return assets.defaultAccommodationImage;

      if (image.startsWith('http')) {
        return image;
      }

      if (image.startsWith('/uploads')) {
        return `${API_BASE_URL}${image}`;
      }

      return `${API_BASE_URL}/uploads/accommodations/${image}`;
    });
  };

  const fetchAccommodationData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/accommodations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch accommodation: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const processedAccommodation = {
          ...result.accommodation,
          images: processAccommodationImages(result.accommodation.images)
        };

        setAccommodation(processedAccommodation);

        if (processedAccommodation.images && processedAccommodation.images.length > 0) {
          setMainImage(processedAccommodation.images[0]);
        } else {
          setMainImage(assets.defaultAccommodationImage);
        }

      } else {
        throw new Error(result.message || 'Failed to fetch accommodation details');
      }
    } catch (error) {
      console.error('Error fetching accommodation data:', error);
      const errorMessage = error.message || 'Failed to load accommodation details';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAccommodationData();
    }
  }, [id, token]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null);
      setTotalMonths(0);
      setTotalCost(0);
      toast.info('Select end date.');
    } else if (date && endDate) {
      calculateTotal(date, endDate);
    } else {
      setTotalMonths(0);
      setTotalCost(0);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date && startDate) {
      calculateTotal(startDate, date);
    } else {
      setTotalMonths(0);
      setTotalCost(0);
    }
  };

  const calculateTotal = (start, end) => {
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // Approximate months
    setTotalMonths(diffMonths);
    if (accommodation) {
      const cost = diffMonths * (accommodation.price_per_month || 0);
      setTotalCost(cost);
    }
  };

  const validateBookingDates = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return false;
    }

    if (startDate > endDate) {
      toast.error('End date must be after start date');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      toast.error('Start date cannot be in the past');
      return false;
    }

    if (numberOfGuests > (accommodation?.maxGuests || accommodation?.bedrooms * 2)) {
      toast.error(`Number of guests exceeds maximum capacity`);
      return false;
    }

    return true;
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
      toast.info('Please login to book this accommodation');
      navigate('/login', { state: { from: `/accommodation/${id}` } });
      return;
    }

    if (!validateBookingDates()) {
      return;
    }
    setShowPaymentPopup(true);
  };

  const createAccommodationBooking = async (paymentDetails = {}) => {
    try {
      setIsBooking(true);

      // Validate required fields
      if (!user?.id || !id || !startDate || !endDate) {
        throw new Error('Missing required booking information');
      }

      const bookingData = {
        renter: user.id,
        accommodation: id,
        owner: accommodation.owner_id,
        booking_start: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        booking_end: endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        numberOfGuests: numberOfGuests,
        securityDeposit: accommodation?.deposit_amount || 0,
        totalPrice: totalCost,
        paymentMethod: paymentMethod,
        booking_status: 'pending',
        paymentDetails: {
          ...paymentDetails,
          paymentDate: new Date().toISOString(),
          paymentAmount: totalCost,
          paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed'
        },
        specialRequests: ''
      };

      console.log('Sending booking data:', bookingData);

      const response = await fetch(`${API_BASE_URL}/api/accommodation-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Booking API error:', result);

        if (result.message && result.message.includes('already booked')) {
          throw new Error('This accommodation is already booked for the selected dates. Please choose different dates.');
        }

        if (result.errors) {
          // Handle validation errors from backend
          const errorMessages = Object.values(result.errors).flat().join(', ');
          throw new Error(errorMessages);
        }

        throw new Error(result.message || `Failed to create booking: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Booking creation failed');
      }

      return result;

    } catch (error) {
      console.error('Booking creation error:', error);
      const errorMessage = error.message || 'Failed to complete booking. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentSuccess = async (paymentData = {}) => {
    try {
      const bookingResult = await createAccommodationBooking(paymentData);

      if (bookingResult) {
        toast.success('Booking successfully!');
        setShowPaymentPopup(false);

        // Reset booking form
        setStartDate(null);
        setEndDate(null);
        setTotalMonths(0);
        setTotalCost(0);
        setNumberOfGuests(1);
      }
    } catch (error) {
      console.error('Payment success handling error:', error);
    }
  };

  const handleContactOwner = () => {
    if (!isLoggedIn) {
      toast.info('Please login to contact the owner');
      navigate('/login', { state: { from: `/accommodation/${id}` } });
      return;
    }

    if (!accommodation?.owner_id) {
      toast.warning('No owner data available for this accommodation');
      return;
    }

    setShowOwnerDetails(true);
  };

  const getBookingDetails = () => {
    if (!accommodation) return null;

    const securityDeposit = accommodation.deposit_amount || 0;
    const totalAmount = totalCost + securityDeposit;

    return {
      type: 'accommodation',
      itemName: accommodation.accommodation_name,
      duration: `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`,
      totalAmount: totalAmount,
      bookingId: `A-${Date.now()}`,
      monthlyRate: accommodation.price_per_month,
      deposit: securityDeposit,
      rentalCost: totalCost,
      securityDeposit: securityDeposit,
      bookingStatus: 'pending',
      numberOfGuests: numberOfGuests
    };
  };

  const handleImageError = (e, imageType = 'image') => {
    console.error(`Failed to load ${imageType}:`, e.target.src);
    e.target.src = assets.defaultAccommodationImage;
  };

  const handleOwnerImageError = (e) => {
    console.error('Failed to load owner image:', e.target.src);
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(accommodation?.owner_id?.fullName || 'Owner')}&background=random&color=fff`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your accommodation details...</p>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="accommodation-not-found">
        <h2 className="accommodation-not-found__title">Accommodation not found</h2>
        <p className="accommodation-not-found__message">
          The accommodation you're looking for doesn't exist or has been removed.
        </p>
        <button
          className="back-button"
          onClick={() => {
            toast.info('Redirecting to available accommodations');
            navigate('/accommodation');
          }}
        >
          Browse Available Accommodations
        </button>
      </div>
    );
  }

  const images = accommodation.images || [];
  const owner = accommodation.owner_id || {};
  const isAvailable = accommodation.available === 'Available' && accommodation.status === 'Active';
  const maxGuests = accommodation.maxGuests || accommodation.bedrooms * 2;

  return (
    <main className="accommodation-details">
      {showOwnerDetails && (
        <OwnerDetails
          owner={owner}
          onClose={() => {
            setShowOwnerDetails(false);
          }}
        />
      )}

      {showPaymentPopup && (
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => {
            setShowPaymentPopup(false);
          }}
          bookingDetails={getBookingDetails()}
          onPaymentSuccess={handlePaymentSuccess}
          paymentMethod={paymentMethod}
          loading={isBooking}
        />
      )}

      <header className="accommodation-header">
        <h1 className="accommodation-title">
          <div className='accommodation-name'>{accommodation.name}</div>
          <div className="accommodation-type">{accommodation.type} • {accommodation.property_type}</div>
        </h1>

        <div className="accommodation-meta">
          <StarRating rating={accommodation.averageRating || 0} />
          <span className="accommodation-review-count">
            {accommodation.totalReviews || 0} review{accommodation.totalReviews !== 1 ? 's' : ''}
          </span>
          {!isAvailable && (
            <span className="accommodation-status-badge">
              {accommodation.status === 'Active' ? 'Not Available' : accommodation.status}
            </span>
          )}
        </div>

        <div className="accommodation-location">
          <img src={assets.locationIcon} alt="Location icon" className="accommodation-location__icon" />
          <span className="accommodation-location__text">{accommodation.address}</span>
        </div>
      </header>

      <section className="accommodation-gallery">
        <div className="accommodation-gallery__main">
          <img
            src={mainImage || assets.defaultAccommodationImage}
            alt={accommodation.accommodation_name}
            className="accommodation-gallery__main-image"
            loading="lazy"
            onError={(e) => handleImageError(e, 'main image')}
          />
        </div>
        {images.length > 0 && (
          <div className="accommodation-gallery__thumbnails">
            {images.slice(0, 4).map((img, index) => (
              <button
                key={index}
                className={`accommodation-gallery__thumbnail ${mainImage === img ? 'accommodation-gallery__thumbnail--active' : ''}`}
                onClick={() => setMainImage(img)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="accommodation-gallery__thumbnail-image"
                  loading="lazy"
                  onError={(e) => handleImageError(e, 'thumbnail')}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="accommodation-content">
        <section className="accommodation-specs">
          <div className="accommodation-Content">
            <h2 className="accommodation-section-title">Property Details</h2>
            <div className="specs-grid">
              <div className="specs-item">
                <span className="specs-title">Accommodation Type</span>
                <span className="specs-value">{accommodation.accommodation_type}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Property Type</span>
                <span className="specs-value">{accommodation.property_type}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Bedrooms</span>
                <span className="specs-value">{accommodation.bedrooms}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Bathrooms</span>
                <span className="specs-value">{accommodation.bathrooms}</span>
              </div>
              <div className="specs-item">
                <span className="specs-title">Maximum Guests</span>
                <span className="specs-value">{maxGuests}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Monthly Rate</span>
                <span className="specs-value">Rs {accommodation.price_per_month?.toLocaleString()}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Security Deposit</span>
                <span className="specs-value">Rs {accommodation.deposit_amount?.toLocaleString()}</span>
              </div>
            </div>

            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div className="amenities-section">
                <h3 className="specs-title">Amenities</h3>
                <div className="amenities-grid">
                  {accommodation.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-text">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="address-section">
              <h3 className="specs-title">Address</h3>
              <p className="specs-text">{accommodation.address}</p>
            </div>

            <div className="description-section">
              <h3 className="specs-title">Description</h3>
              <p className="specs-text">
                {accommodation.description || 'No description provided yet. Please check back later for more information.'}
              </p>
            </div>
          </div>

          <div className="accommodation-Content map">
            <h3 className="accommodation-section-title">Location</h3>
            <div className="map-container">
              <GoogleMapEmbed
                address={accommodation.address}
                latitude={accommodation.location?.coordinates?.[1]}
                longitude={accommodation.location?.coordinates?.[0]}
              />
            </div>
          </div>

          <section className="accommodation-Content accommodation-reviews">
            <h2 className="accommodation-section-title">Reviews</h2>

            <div className="reviews-summary">
              <div className="reviews-overview">
                <span className="reviews-average">{(accommodation.averageRating || 0).toFixed(1)}</span>
                <StarRating rating={accommodation.averageRating || 0} />
                <span>{accommodation.totalReviews || 0} review{accommodation.totalReviews !== 1 ? 's' : ''}</span>
              </div>

              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = accommodation.ratingCount?.[star] || 0;
                  const percentage = accommodation.totalReviews
                    ? (count / accommodation.totalReviews) * 100
                    : 0;

                  return (
                    <div className="rating-row" key={star}>
                      <span className="star-label">{star} star{star !== 1 ? 's' : ''}</span>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="rating-count">({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="accommodation-Content accommodation-host">
            <h2 className="accommodation-section-title">Property Owner</h2>
            <div className="host-profile">
              <img
                src={owner.profile_pic
                  ? `${API_BASE_URL}${owner.profile_pic}?t=${Date.now()}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName || 'Owner')}&background=random&color=fff`
                }
                alt={`${owner?.displayName || owner?.fullName || 'Property Owner'}'s profile`}
                className="host-avatar"
                onError={handleOwnerImageError}
              />
              <div className="host-info">
                <h4 className="host-name">
                  Owned by {owner?.displayName || owner?.fullName || 'Property Owner'}
                </h4>
                {owner?.averageRating && (
                  <div className="host-rating">
                    <StarRating rating={owner.averageRating} size="small" />
                    <span>{owner.totalReviews || 0} review{owner.totalReviews !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {owner?.phoneNumber && (
                  <div className="host-phone">
                    <span>{owner.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              className="host-contact-button"
              onClick={handleContactOwner}
              aria-label="Contact property owner"
            >
              Contact Owner
            </button>
          </section>
        </section>

        <aside className="accommodation-booking">
          <div className="booking-card">
            <div className="booking-card-header">
              <h3 className="accommodation-section-title">Booking</h3>
              <div className="booking-price">
                Rs {accommodation.price_per_month?.toLocaleString()}
                <span className="price-period"> / month</span>
              </div>
            </div>

            <div className="booking-dates">
              <div className="booking-date-group">
                <label className="booking-label">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  placeholderText="Select start date"
                  className="booking-dates__input"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>
              <div className="booking-date-group">
                <label className="booking-label">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  minDate={startDate || new Date()}
                  placeholderText="Select end date"
                  className="booking-dates__input"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  disabled={!startDate}
                />
              </div>
            </div>

            <div className="guests-section">
              <label className="booking-label">Number of Guests</label>
              <select
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                className="guests-select"
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="payment-method-section">
              <label className="booking-label">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-method__select"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="cash">Cash</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div className="booking-summary">
              <div className="booking-summary__item">
                <span>Rental Months:</span>
                <span>{totalMonths || 0} month{totalMonths !== 1 ? 's' : ''}</span>
              </div>
              <div className="booking-summary__item">
                <span>Monthly Rate:</span>
                <span>Rs {accommodation.price_per_month?.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--subtotal">
                <span>Rental Cost:</span>
                <span>Rs {(totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item">
                <span>Security Deposit:</span>
                <span>Rs {accommodation.deposit_amount?.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--total">
                <span>Total Amount:</span>
                <span>Rs {totalMonths > 0
                  ? (totalCost + (accommodation.deposit_amount || 0)).toLocaleString()
                  : 0}</span>
              </div>
            </div>

            <div className="booking-deposit">
              <span>Security Deposit: Rs {accommodation.deposit_amount?.toLocaleString()} (refundable after stay)</span>
            </div>

            <button
              className={`booking-button ${!isAvailable ? 'booking-button--disabled' : ''}`}
              onClick={handleBookNow}
              disabled={!isAvailable || totalMonths === 0 || isBooking}
            >
              {isBooking ? 'Processing...' :
                !isAvailable ? 'Not Available' :
                  'Book Now'}
            </button>

          </div>
        </aside>
      </div>
    </main>
  );
};

export default AccommodationDetails;