import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import avatar1 from '../../Assets/About/testimonial1.jpg'
import avatar2 from '../../Assets/About/testimonial2.jpg'
import './TestimonialCarousel.css'

const testimonials = [
  {
    id: 1,
    name: "Sanduni Weerasinghe",
    location: "Ratnapura, Sri Lanka",
    text: "I easily found a safe and budget-friendly boarding place near Sabaragamuwa University. The booking process was smooth and reliable!",
    avatar: avatar1,
    rating: 5
  },
  {
    id: 2,
    name: "Nisal Fernando",
    location: "Kegalle, Sri Lanka",
    text: "Rented a bike to travel from Pambahinna to campus. The bike was in great condition and the rental was very affordable.",
    avatar: avatar2,
    rating: 4
  },
  {
    id: 3,
    name: "Kavindu Rathnayake",
    location: "Balangoda, Sri Lanka",
    text: "This platform is a life-saver for new students. Everything is clear—rooms, transport, prices, and contact info—all in one place!",
    avatar: avatar1,
    rating: 5
  },
  {
    id: 4,
    name: "Nisal Fernando",
    location: "Kegalle, Sri Lanka",
    text: "Rented a bike to travel from Pambahinna to campus. The bike was in great condition and the rental was very affordable.",
    avatar: avatar2,
    rating: 4
  },
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonial-carousel">
      <div className="section-header">
        <h2>What Our Customers Say</h2>
        <p>Hear from travelers who've used our services</p>
      </div>

      <div className="carousel-container">
        <button className="nav-button prev" onClick={prevTestimonial}>
          <ChevronLeft size={24} />
        </button>

        <div className="testimonial-card">
          <div className="testimonial-content">
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < testimonials[currentIndex].rating ? "filled" : ""}>
                  ★
                </span>
              ))}
            </div>
            <p className="testimonial-text">"{testimonials[currentIndex].text}"</p>
            <div className="author-info">
              <img 
                src={testimonials[currentIndex].avatar} 
                alt={testimonials[currentIndex].name}
                className="avatar"
              />
              <div>
                <h4>{testimonials[currentIndex].name}</h4>
                <p className="location">{testimonials[currentIndex].location}</p>
              </div>
            </div>
          </div>
        </div>

        <button className="nav-button next" onClick={nextTestimonial}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;