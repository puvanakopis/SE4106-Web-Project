import React from 'react'
import Hero from "../Components/Home/Hero"
import PopularRooms from '../Components/Home/PopularRooms'
import Heading from '../Components/Home/Heading'
import WhyChooseUs from '../Components/Home/WhyChooseUs'
import PopularTransport from '../Components/Home/PopularTransport'
import AboutSection from '../Components/Home/AboutSection'
import TestimonialCarousel from '../Components/Home/TestimonialCarousel'

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularRooms />
      <Heading title="Why Choose Us?" />
      <WhyChooseUs />
      <Heading title="Our Popular Transport Options" />
      <PopularTransport/>
      <AboutSection/>
      <Heading title="What Our Customers Say" />
      <TestimonialCarousel/>
    </div>
  )
}

export default Home