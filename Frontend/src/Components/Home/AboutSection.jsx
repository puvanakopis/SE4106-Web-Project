import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-home">
      <div className="section-container">
        <div className="section-header">
          <h2>Discover More About Us</h2>
          <p>
            Find trusted accommodation and easy transport solutions for university life in Sri Lanka.
            Our platform connects students, lecturers, and landlords with verified boarding places,
            shared apartments, and reliable daily commute options.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>Verified Accommodations</h3>
            <p>Quality-checked living spaces near campus</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚌</div>
            <h3>Reliable Transport</h3>
            <p>Trusted commute options for students</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>Student-Focused</h3>
            <p>Solutions designed for academic life</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;