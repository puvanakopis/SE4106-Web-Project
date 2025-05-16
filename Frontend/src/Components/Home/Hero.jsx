import './Hero.css'
import hero from '../../Assets/Home/home-banner.png'

const Hero = () => {
  return (
    <div className='hero-container'>
      <img src={hero} alt="Hero Banner" className="hero-image" />
    </div>
  )
}

export default Hero