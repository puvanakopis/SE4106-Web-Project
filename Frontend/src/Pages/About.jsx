import "./About.css";
import hero from "../Assets/about.png";

const About = () => {
  return (
    <>
      {/* Banner */}
      <div className='hero-container' >
        <img src={hero} alt="Hero Banner" className="hero-image" />
      </div >

      <div className="web-about">
        {/* Our Story */}
        <section className="about-section ">
          <h2 className="section-title">Our Story</h2>
          <p className="section-text">
            CampusEase was founded with a simple goal—to solve the everyday challenge of finding safe, affordable accommodation for university students and lecturers across Sri Lanka. After experiencing the struggle firsthand, we realized the need for a dedicated platform that connects seekers with trusted hosts. UniStay now helps bridge that gap by offering verified listings, user-friendly features, and reliable support.
          </p>
        </section>

        {/* Mission and Vision */}
        <section className="about-section ">
          <h2 className="section-title">Our Mission And Vision</h2>
          <div className="grid-container">
            <div className="card">
              <h3 className="card-title">Our Mission</h3>
              <p className="card-text">
                To make the process of finding academic accommodation easy, transparent, and secure for every student and lecturer in Sri Lanka.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Our Vision</h3>
              <p className="card-text">
                To become Sri Lanka’s most trusted platform for university accommodation, empowering academic communities through comfort, convenience, and connectivity.
              </p>
            </div>
          </div>
        </section>

        {/* How It Helps */}
        <section className="about-section ">
          <h2 className="section-title">How CampusEase Helps</h2>
          <div className="grid-features">
            <div><p>🏠 Verified Boarding Houses</p></div>
            <div><p>📍 Nearby To Campus Locations</p></div>
            <div><p>💬 Easy Booking Via Web</p></div>
            <div><p>🚲 Transport Add-ons Like Bikes</p></div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="testimonial">
          “CampusEase helped me find a place near my University”
        </section>
      </div>
    </>
  );
}

export default About;