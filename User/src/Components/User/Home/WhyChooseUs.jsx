import React from 'react';
import { useInView } from 'react-intersection-observer';
import './WhyChooseUs.css';
import { FaShieldAlt, FaCreditCard, FaHeadset } from 'react-icons/fa';

const WhyChooseUs = () => {
  const [containerRef, containerInView] = useInView({
    threshold: 0.1
  });

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1
  });

  return (
    <section className="why-choose-us" ref={containerRef}>
      <div className="section-container">
        <div className={`section-header ${containerInView ? 'slide-in-left' : ''}`}>
          <h2>Why Choose Us?</h2>
          <p>
            Making your university journey easier with trusted stays and reliable support
          </p>
        </div>

        <div className={`features-grid ${featuresInView ? 'slide-in-right' : ''}`} ref={featuresRef}>
          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Verified Options</h3>
            <p>All accommodations and transport options pass our strict quality checks</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaCreditCard />
            </div>
            <h3>Secure Payments</h3>
            <p>Multiple payment options with industry-standard security</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaHeadset />
            </div>
            <h3>24/7 Support</h3>
            <p>Our dedicated team is always available to assist you</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;