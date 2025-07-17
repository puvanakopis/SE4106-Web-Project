import React, { useState } from 'react';
import { FaTimes, FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import './PaymentPopup.css';

const PaymentPopup = ({
    isOpen,
    onClose,
    bookingDetails,
    onPaymentSuccess,
    paymentMethod
}) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);

            // Auto close after showing success
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
                resetForm();
            }, 2000);
        }, 2000);
    };

    const resetForm = () => {
        setCardNumber('');
        setCardHolder('');
        setExpiryDate('');
        setCvv('');
        setIsProcessing(false);
        setIsSuccess(false);
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
                    <button className="payment-popup-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {!isSuccess ? (
                    <>
                        <div className="payment-summary">
                            <div className="payment-summary-item">
                                <span>Booking Type:</span>
                                <span>{bookingDetails.type === 'room' ? 'Room' : 'Vehicle'}</span>
                            </div>
                            <div className="payment-summary-item">
                                <span>Item:</span>
                                <span>{bookingDetails.itemName}</span>
                            </div>
                            <div className="payment-summary-item">
                                <span>Duration:</span>
                                <span>{bookingDetails.duration}</span>
                            </div>
                            <div className="payment-summary-item payment-summary-item--total">
                                <span>Total Amount:</span>
                                <span>Rs {bookingDetails.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="payment-method-display">
                            <div className="payment-method-badge">
                                <FaCreditCard />
                                <span>{paymentMethod === 'credit_card' ? 'Credit Card' :
                                    paymentMethod === 'debit_card' ? 'Debit Card' :
                                        paymentMethod === 'upi' ? 'UPI' :
                                            paymentMethod === 'net_banking' ? 'Net Banking' : 'Cash'}</span>
                            </div>
                        </div>

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
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cardHolder">Card Holder Name</label>
                                    <input
                                        type="text"
                                        id="cardHolder"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                        placeholder="Puvanakopis"
                                        required
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
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing Payment...' : `Pay Rs ${bookingDetails.totalAmount.toLocaleString()}`}
                                </button>
                            </form>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="cash-payment-info">
                                <div className="cash-payment-message">
                                    <p>You have selected cash payment. Please pay the amount of <strong>Rs {bookingDetails.totalAmount.toLocaleString()}</strong> when you arrive.</p>
                                    <p>Your booking will be confirmed once the payment is received.</p>
                                </div>
                                <button
                                    className="payment-submit-button"
                                    onClick={handleSubmit}
                                    disabled={isProcessing}
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
                        <p>Your booking has been confirmed. You will receive a confirmation email shortly.</p>
                        <div className="success-details">
                            <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
                            <p><strong>Amount Paid:</strong> Rs {bookingDetails.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPopup;