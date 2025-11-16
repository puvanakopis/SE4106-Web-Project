import React, { useState } from 'react';
import { FaTimes, FaCreditCard, FaLock, FaCheckCircle, FaUser, FaCalendarAlt } from 'react-icons/fa';
import './PaymentPopup.css';

const PaymentPopup = ({
    isOpen,
    onClose,
    bookingDetails,
    onPaymentSuccess,
    paymentMethod,
    isLoading = false
}) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentError('');
        
        if (paymentMethod !== 'cash') {
            if (!validateCardDetails()) {
                return;
            }
        }

        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Prepare payment data according to backend schema
            const paymentData = {
                cardNumber: paymentMethod !== 'cash' ? cardNumber.replace(/\s/g, '') : undefined,
                cardHolderName: paymentMethod !== 'cash' ? cardHolder : undefined,
                paymentDate: new Date().toISOString(),
                paymentAmount: bookingDetails.totalAmount,
                paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed'
            };

            setIsProcessing(false);
            setIsSuccess(true);

            // Auto close after showing success
            setTimeout(() => {
                onPaymentSuccess(paymentData);
                resetForm();
            }, 2000);
        } catch (error) {
            setIsProcessing(false);
            setPaymentError(`Payment processing failed. Please try again. ${error.message}`);
        }
    };

    const validateCardDetails = () => {
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        
        if (!cleanCardNumber || cleanCardNumber.length !== 16) {
            setPaymentError('Please enter a valid 16-digit card number');
            return false;
        }
        
        if (!/^\d+$/.test(cleanCardNumber)) {
            setPaymentError('Card number must contain only digits');
            return false;
        }

        if (!cardHolder || cardHolder.trim().length < 3) {
            setPaymentError('Please enter card holder name (min 3 characters)');
            return false;
        }

        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            setPaymentError('Please enter a valid expiry date (MM/YY)');
            return false;
        }

        // Validate expiry date is not in the past
        const [month, year] = expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        const expMonth = parseInt(month);
        const expYear = parseInt(year);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            setPaymentError('Card has expired');
            return false;
        }

        if (!cvv || !/^\d+$/.test(cvv) || (cvv.length !== 3 && cvv.length !== 4)) {
            setPaymentError('Please enter a valid CVV (3 or 4 digits)');
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setCardNumber('');
        setCardHolder('');
        setExpiryDate('');
        setCvv('');
        setIsProcessing(false);
        setIsSuccess(false);
        setPaymentError('');
    };

    const handleClose = () => {
        if (!isProcessing) {
            resetForm();
            onClose();
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    if (!isOpen) return null;

    return (
        <div className="payment-popup-overlay">
            <div className="payment-popup">
                <div className="payment-popup-header">
                    <h2 className="payment-popup-title">Complete Payment</h2>
                    <button 
                        className="payment-popup-close" 
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        <FaTimes />
                    </button>
                </div>

                {!isSuccess ? (
                    <>
                        <div className="payment-summary">
                            <h3 className="payment-summary-title">Booking Summary</h3>
                            <div className="payment-summary-item">
                                <span><FaUser className="summary-icon" /> Booking Type:</span>
                                <span>Vehicle Rental</span>
                            </div>
                            <div className="payment-summary-item">
                                <span><FaCalendarAlt className="summary-icon" /> Vehicle:</span>
                                <span>{bookingDetails.itemName}</span>
                            </div>
                            <div className="payment-summary-item">
                                <span><FaCalendarAlt className="summary-icon" /> Duration:</span>
                                <span>{bookingDetails.duration}</span>
                            </div>
                            {bookingDetails.dailyRate && (
                                <div className="payment-summary-item">
                                    <span>Daily Rate:</span>
                                    <span>Rs {bookingDetails.dailyRate.toLocaleString()}</span>
                                </div>
                            )}
                            {bookingDetails.rentalCost > 0 && (
                                <div className="payment-summary-item">
                                    <span>Rental Cost:</span>
                                    <span>Rs {bookingDetails.rentalCost.toLocaleString()}</span>
                                </div>
                            )}
                            {bookingDetails.securityDeposit > 0 && (
                                <div className="payment-summary-item">
                                    <span>Security Deposit:</span>
                                    <span>Rs {bookingDetails.securityDeposit.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="payment-summary-item payment-summary-item--total">
                                <span>Total Amount:</span>
                                <span>Rs {bookingDetails.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="payment-method-display">
                            <div className="payment-method-badge">
                                <FaCreditCard />
                                <span>
                                    {paymentMethod === 'credit_card' ? 'Credit Card' :
                                     paymentMethod === 'debit_card' ? 'Debit Card' :
                                     paymentMethod === 'cash' ? 'Cash on Delivery' : 'Payment'}
                                </span>
                            </div>
                        </div>

                        {paymentError && (
                            <div className="payment-error-message">
                                {paymentError}
                            </div>
                        )}

                        {paymentMethod !== 'cash' && (
                            <form onSubmit={handleSubmit} className="payment-form">
                                <div className="form-group">
                                    <label htmlFor="cardNumber">Card Number</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        required
                                        disabled={isProcessing || isLoading}
                                        className={paymentError && !cardNumber ? 'input-error' : ''}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cardHolder">Card Holder Name</label>
                                    <input
                                        type="text"
                                        id="cardHolder"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                        placeholder="JOHN DOE"
                                        required
                                        disabled={isProcessing || isLoading}
                                        className={paymentError && !cardHolder ? 'input-error' : ''}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="expiryDate">Expiry Date</label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            required
                                            disabled={isProcessing || isLoading}
                                            className={paymentError && !expiryDate ? 'input-error' : ''}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cvv">CVV</label>
                                        <input
                                            type="text"
                                            id="cvv"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                            disabled={isProcessing || isLoading}
                                            className={paymentError && !cvv ? 'input-error' : ''}
                                        />
                                    </div>
                                </div>

                                <div className="payment-security">
                                    <FaLock />
                                    <span>Your payment information is secure and encrypted</span>
                                </div>

                                <button
                                    type="submit"
                                    className="payment-submit-button"
                                    disabled={isProcessing || isLoading}
                                >
                                    {isProcessing ? 'Processing Payment...' : `Pay Rs ${bookingDetails.totalAmount.toLocaleString()}`}
                                </button>
                            </form>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="cash-payment-info">
                                <div className="cash-payment-message">
                                    <h4>Cash Payment Instructions</h4>
                                    <p>You have selected cash payment. Please pay the amount of <strong>Rs {bookingDetails.totalAmount.toLocaleString()}</strong> when you pick up the vehicle.</p>
                                    <div className="cash-details">
                                        <p><strong>Rental Cost:</strong> Rs {bookingDetails.rentalCost.toLocaleString()}</p>
                                        <p><strong>Security Deposit:</strong> Rs {bookingDetails.securityDeposit.toLocaleString()} (refundable)</p>
                                    </div>
                                    <p>Your booking will be confirmed once the payment is received.</p>
                                </div>
                                <button
                                    className="payment-submit-button"
                                    onClick={handleSubmit}
                                    disabled={isProcessing || isLoading}
                                >
                                    {isProcessing ? 'Confirming Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="payment-success">
                        <FaCheckCircle className="success-icon" />
                        <h3>Payment Successful!</h3>
                        <p>Your booking has been confirmed. You will receive a confirmation shortly.</p>
                        <div className="success-details">
                            <p><strong>Booking Type:</strong> Vehicle Rental</p>
                            <p><strong>Vehicle:</strong> {bookingDetails.itemName}</p>
                            <p><strong>Duration:</strong> {bookingDetails.duration}</p>
                            <p><strong>Amount Paid:</strong> Rs {bookingDetails.totalAmount.toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> 
                                {paymentMethod === 'credit_card' ? 'Credit Card' :
                                 paymentMethod === 'debit_card' ? 'Debit Card' :
                                 paymentMethod === 'cash' ? 'Cash' : 'Payment'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPopup;