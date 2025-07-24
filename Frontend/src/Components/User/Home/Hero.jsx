import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { scrollToTop } from '../../../Pages/scrollToTop';
import './Hero.css';

const Hero = () => {
  const [heroRef, heroInView] = useInView({
    threshold: 0.1
  });

  return (
    <section className="home-hero" ref={heroRef}>
      <div className="hero-content">
        <h1 className={`${heroInView ? 'slide-in-left' : ''}`}>Your Complete Campus Living Solution</h1>
        <p className={`${heroInView ? 'slide-in-right delay-100' : ''}`}>
          Trusted housing and reliable transport for Sabaragamuwa University community
        </p>
        <div className={`hero-actions ${heroInView ? 'scale-up' : ''}`}>
          <Link to={'./accommodation'} className="btn" onClick={scrollToTop}>Find Verified Rooms</Link>
          <Link to={'./transport'} className="btn" onClick={scrollToTop}>Book Campus Transport</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;