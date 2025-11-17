import React, { useState } from 'react';
import Hero from "../../Components/User/Home/Hero";
import PopularAccommodations from '../../Components/User/Home/PopularAccommodations';
import PopularTransport from '../../Components/User/Home/PopularTransport';
import WhyChooseUs from '../../Components/User/Home/WhyChooseUs';
import AboutSection from '../../Components/User/Home/AboutSection';
import TestimonialCarousel from '../../Components/User/Home/TestimonialCarousel';

const Home = () => {
  const [accommodationsLoading, setAccommodationsLoading] = useState(false);
  const [transportLoading, setTransportLoading] = useState(false);

  const isLoading = accommodationsLoading || transportLoading;

  // if (isLoading) {
  //   return (
  //     <div className="booking-container">
  //       <div className="dashboard-loading">
  //         <div className="loading-spinner"></div>
  //         <p>Loading your home page...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Hero />
      <PopularAccommodations setLoading={setAccommodationsLoading} />
      <WhyChooseUs />
      <PopularTransport setLoading={setTransportLoading} />
      <AboutSection />
      <TestimonialCarousel />
    </div>
  );
};

export default Home;