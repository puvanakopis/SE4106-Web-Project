import React from 'react';
import './WhyChooseUs.css';
import { FaPhone, FaUsers, FaHeadset } from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaPhone size={40} />,
      title: 'Fast Booking',
      description: 'Book your room or transport in just a few clicks, saving you time and hassle.',
    },
    {
      icon: <FaUsers size={40} />,
      title: 'Real Customer Reviews',
      description: 'Genuine reviews help you make the best choice for your stay or travel.',
    },
    {
      icon: <FaHeadset size={40} />,
      title: '24/7 Support',
      description: 'Our support team is ready anytime to help you with bookings or changes.',
    },
  ];

  return (
    <div className="why-section">
      {/* Container for all feature cards */}
      <div className="card-container">
        {features.map((feature, index) => (
          
          // feature card
          <div key={index} className="feature-card">
            <div className="icon-circle">{feature.icon}</div>
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;