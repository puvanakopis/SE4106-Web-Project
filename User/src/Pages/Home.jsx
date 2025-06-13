import React from 'react'
import Hero from "../Components/Home/Hero"
import PopularRooms from '../Components/Home/PopularRooms'
import WhyChooseUs from '../Components/Home/WhyChooseUs'
import PopularTransport from '../Components/Home/PopularTransport'
import AboutSection from '../Components/Home/AboutSection'
import TestimonialCarousel from '../Components/Home/TestimonialCarousel'

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularRooms />
      <WhyChooseUs />
      <PopularTransport/>
      <AboutSection/>
      <TestimonialCarousel/>
    </div>
  )
}

export default Home