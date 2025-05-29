import hero from "../Assets/about.png";
import './Contact.css';

const Contact = () => {
    return (
        <>
            {/* Banner */}
            <div className='hero-container'>
                <img src={hero} alt="Hero Banner" className="hero-image" />
            </div>


            <section className="contact-section">
                <div className="contact-container">

                    {/* Heading */}
                    <div className="heading">
                        <h1 className="contact-heading">
                            Get in Touch with CampusEase
                        </h1>
                    </div>
                    <p className="contact-description">
                        Whether you have questions, feedback, or need support, we're here to help. Reach out to us and we'll get back to you shortly.
                    </p>

                    <div className="contact-grid">
                       
                        {/* Contact Form */}
                        <div className="contact-form">
                            <h2 className="form-heading">Send Us a Message</h2>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        placeholder="Write your message here..."
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-button">
                                    Submit
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2 className="info-heading">Contact Information</h2>
                            <p><strong>Phone:</strong> 123-456-7890</p>
                            <p><strong>Email:</strong> campusease@email.com</p>
                            <p><strong>Location:</strong> University Road, Pambahinna, Belihuloya 70140, Sri Lanka</p>

                            <h3 className="follow-heading">Follow Us</h3>
                            <div className="social-links">
                                <a href="#">Facebook</a>
                                <a href="#">Twitter</a>
                                <a href="#">Instagram</a>
                                <a href="#">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;