import { Link } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  return (
    <section className="home-hero">
      <div className="hero-content">
        <h1>Your Complete Campus Living Solution</h1>
        <p>Trusted housing and reliable transport for Sabaragamuwa University community</p>
        <div className="hero-actions">
          <Link to={'./accommodation'} className="btn">Find Verified Rooms</Link>
          <Link to={'./transport'} className="btn">Book Campus Transport</Link>
        </div>
      </div>
    </section>
  )
}

export default Hero