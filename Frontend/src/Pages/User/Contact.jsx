import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setTimeout(() => setSubmitted(false), 3000);
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <>
            {/* ------------- Hero Section -------------*/}
            <section className="contact-hero">
                <div className="hero-content">
                    <h1>Contact Us</h1>
                    <p>We're here to help and answer any questions you might have</p>
                </div>
            </section>


            <div className="contact-page">
                <section className="contact-section">
                    {/*  Contact Information  */}
                    <div className="contact-info">
                        <h2 className='section-header'>Get in Touch</h2>
                        <div className='contact-info-container'>
                            <div className="info-item">
                                <FaMapMarkerAlt className="icon" />
                                <div>
                                    <h3>Address</h3>
                                    <p>University Road, Pambahinna, Belihuloya 70140, Sri Lanka</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FaPhoneAlt className="icon" />
                                <div>
                                    <h3>Phone</h3>
                                    <p>1234567890</p>
                                    <p>Mon-Fri: 9am - 6pm</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FaEnvelope className="icon" />
                                <div>
                                    <h3>Email</h3>
                                    <p>campusease@email.com</p>
                                    <p>Response within 24 hours</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FaGlobe className="icon" />
                                <div>
                                    <h3>Website</h3>
                                    <p>www.campusease.com</p>
                                    <p>Visit for more info</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Contact Form */}
                    <div className="contact-form">
                        <h2 className='section-header'>Send Us a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    placeholder="Type your message here..."
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-button">
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>

                {/* ------------- Map Section ------------- */}
                <section className="map-section">
                    <div className="map-text-content">
                        <h2 className='section-header'>Visit Our Office</h2>
                        <div className="office-hours">
                            <h3>Office Hours</h3>
                            <ul>
                                <li><strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM</li>
                                <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM</li>
                                <li><strong>Sunday:</strong> Closed</li>
                            </ul>
                        </div>
                    </div>

                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.4517358854396!2d80.78464357448158!3d6.7145965209142044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae38a5d15e55917%3A0x92bb8770edf29b53!2sSabaragamuwa%20University%20of%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1748275157732!5m2!1sen!2slk"
                            className="w-full h-full"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Sabaragamuwa University of Sri Lanka"
                        ></iframe>
                    </div>
                </section>

                {/* ------------- FAQ Section ------------- */}
                <section className="faq-section">
                    <h2 className='section-header'>Frequently Asked Questions</h2>
                    <div className="faq-container">
                        {[
                            {
                                question: "How do I book accommodation?",
                                answer: "You can browse our available properties, select your preferred room, and complete the booking process online. Our system will guide you through each step."
                            },
                            {
                                question: "What payment methods do you accept?",
                                answer: "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and digital payment methods like PayPal."
                            },
                            {
                                question: "Can I cancel or modify my booking?",
                                answer: "Yes, you can modify or cancel your booking up to 7 days before your scheduled move-in date. Please check the specific cancellation policy for your chosen accommodation."
                            },
                            {
                                question: "What safety measures are in place?",
                                answer: "All our properties undergo thorough safety inspections. We verify property owners, conduct background checks where applicable, and ensure all properties meet our safety standards."
                            }
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggleFaq(index)}
                                    aria-expanded={activeFaq === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    {faq.question}
                                    <span className="toggle-icon">{activeFaq === index ? '-' : '+'}</span>
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    className="faq-answer"
                                    role="region"
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Contact;