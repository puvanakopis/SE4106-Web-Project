import React from 'react';
import './AboutSection.css';
import aboutImage from '../../Assets/Home/Popular-Rooms.png'; 

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        
        {/* Left Content */}
        <div className="about-text">
          <div className='titleSection'>Discover More About Us</div>
          <p>
            Find trusted accommodation and easy transport solutions for university life in Sri Lanka.
            Our platform connects students, lecturers, and landlords with verified boarding places,
            shared apartments, and reliable daily commute options.
          </p>
          <button className="learn-button">
            Learn more about us <span className="arrow">»</span>
          </button>
        </div>

        {/* Right Image */}
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
