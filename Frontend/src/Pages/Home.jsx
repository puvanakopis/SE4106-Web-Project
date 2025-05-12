import React from 'react'
import Hero from "../Components/Home/Hero"
import PopularRooms from '../Components/Home/PopularRooms'
import Heading from '../Components/Home/Heading'
import WhyChooseUs from '../Components/Home/WhyChooseUs'

const Home = () => {
  return (
    <div>
      <Hero />
      <Heading title="Our Popular Rooms" />
      <PopularRooms />
      <Heading title="Why Choose Us?" />
      <WhyChooseUs />
      <Heading title="Our Popular Transport Options" />
    </div>
  )
}

export default Home