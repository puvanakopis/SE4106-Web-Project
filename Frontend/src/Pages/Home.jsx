import React from 'react'
import Hero from "../Components/Home/Hero"
import PopularRooms from '../Components/Home/PopularRooms'
import Heading from '../Components/Home/Heading'

const Home = () => {
  return (
    <div>
      <Hero/>
      <Heading title= "Our Popular Rooms"/>
      <PopularRooms/>
    </div>
  )
}

export default Home