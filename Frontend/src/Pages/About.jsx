import React from 'react';
import testimonial1 from '../Assets/About/testimonial1.jpg'
import testimonial2 from '../Assets/About/testimonial2.jpg'
import './About.css'

const About = () => {
  return (
    <>{/* ------------- Hero Section ------------- */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Us</h1>
          <p>Exclusive accommodation solutions for Sabaragamuwa University students and staff</p>
        </div>
      </section>
     
     
      <div className="about-page">
        {/* ------------- Mission Section ------------- */}
        <section className="about-section mission-section">
          <div className="section-header">
            <h2>Our Mission</h2>
            <p>Serving the Sabaragamuwa University community with trusted housing</p>
            <div>
              We specialize in connecting Sabaragamuwa University students and lecturers with
              quality, affordable housing options in Belihuloya and surrounding areas.
              Our platform addresses the unique accommodation challenges faced by our university community.
              <br /><br />
              From verified boarding houses to shared apartments near campus, we ensure every listing
              meets strict safety and quality standards. Our integrated transport solutions help
              overcome the mobility challenges in the Belihuloya area.
            </div>
          </div>
        </section>

        {/* ------------- Statistics Section ------------- */}
        <section className="about-stats">
          <div className="stats-container">
            <div className="stat-item">
              <h3>1,200+</h3>
              <p>Sab Students Helped</p>
            </div>
            <div className="stat-item">
              <h3>300+</h3>
              <p>Verified Listings</p>
            </div>
            <div className="stat-item">
              <h3>5+</h3>
              <p>Nearby Locations</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Campus Support</p>
            </div>
          </div>
        </section>

        {/* ------------- Testimonials Section ------------- */}
        <section className="about-section testimonials-section">
          <div className="section-header">
            <h2>Sabaragamuwa Experiences</h2>
            <p>What our university community says about us</p>
          </div>
          <div className="testimonials">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "Finding accommodation as a first-year at Sabaragamuwa was overwhelming until
                  I found this service. My boarding place is just 10 minutes from the lecture halls."
                </p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial1} alt="Student" />
                <div>
                  <h5>Sanjaya Bandara</h5>
                  <p>1st Year Science Student</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "The transport booking feature saved me countless hours commuting from Balangoda.
                  Now I can reliably get to my 8am lectures on time."
                </p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial2} alt="Lecturer" />
                <div>
                  <h5>Dr. Anoma Herath</h5>
                  <p>Faculty of Management Studies</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;