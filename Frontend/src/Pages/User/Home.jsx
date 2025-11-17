import Hero from "../../Components/User/Home/Hero"
import PopularAccommodations from '../../Components/User/Home/PopularAccommodations'
import WhyChooseUs from '../../Components/User/Home/WhyChooseUs'
import PopularTransport from '../../Components/User/Home/PopularTransport'
import AboutSection from '../../Components/User/Home/AboutSection'
import TestimonialCarousel from '../../Components/User/Home/TestimonialCarousel'

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularAccommodations />
      <WhyChooseUs />
      <PopularTransport/>
      <AboutSection/>
      <TestimonialCarousel/>
    </div>
  )
}

export default Home