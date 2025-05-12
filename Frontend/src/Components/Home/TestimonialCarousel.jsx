import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./TestimonialCarousel.css";

const testimonials = [
    {
        quote:
            "This system has truly revolutionized how we manage our properties. From scheduling to tracking, every feature is designed to be intuitive. The interface is clean, responsive, and incredibly easy to navigate. Highly recommended for any serious team looking to streamline operations.",
        author: "Jane Smith",
    },
    {
        quote:
            "We’ve seen a 40% boost in productivity since switching to this platform. The workflow is seamless, and our staff quickly adapted to it without any formal training. It’s modern, reliable, and truly built with the user in mind. We can't imagine going back.",
        author: "Michael Johnson",
    },
    {
        quote:
            "Customer support is top-notch. Whenever we encountered even the smallest issue, their team responded almost instantly and walked us through the solution step by step. It’s rare to find such a level of support these days.",
        author: "Samantha Lee",
    },
    {
        quote:
            "A very professional and polished experience. The dashboard provides all the analytics we need at a glance, helping us make better decisions faster. It’s the kind of tool that actually makes your job easier—not harder.",
        author: "David Thompson",
    },
    {
        quote:
            "After trying multiple systems over the years, this is by far the most intuitive and powerful. It simplifies everything we do on a daily basis, from communication to documentation, and everything in between.",
        author: "Priya Kumar",
    },
    {
        quote:
            "The user interface is both beautiful and functional. It's clear that a lot of thought went into the design. Our entire team was able to get up and running with no learning curve at all. It’s a breath of fresh air.",
        author: "Carlos Rodriguez",
    },
    {
        quote:
            "From onboarding to daily use, the entire experience has been smooth and efficient. The features are rich, yet easy to use, and have greatly improved our workflow. A must-have tool for any modern business looking to stay ahead.",
        author: "Emma Wilson",
    }
];

const TestimonialSlider = () => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);


    // Triggers fade-out
    const triggerFade = (newIndex) => {
        setFade(false);
        setTimeout(() => {
            setIndex(newIndex);
            setFade(true);
        }, 200);
    };

    
    // Navigate to the previous testimonial
    const prev = () => {
        const newIndex = index === 0 ? testimonials.length - 1 : index - 1;
        triggerFade(newIndex);
    };

    const next = () => {
        const newIndex = index === testimonials.length - 1 ? 0 : index + 1;
        triggerFade(newIndex);
    };


    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 5000);
        return () => clearInterval(interval);
    });



    return (
        <div className="testimonial-container">

            {/* Testimonial Box */}
            <div className="testimonial-box">

                {/* Quote and Author */}
                <div className={`testimonial-content ${fade ? "fade-in" : "fade-out"}`}>
                    <div className="testimonial-quote">
                        "{testimonials[index].quote}"
                    </div>
                    <div className="testimonial-author">
                        — {testimonials[index].author} —
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button className="testimonial-button left" onClick={prev}  aria-label="Previous testimonial">
                    <ChevronLeft size={45} />
                </button>
                <button className="testimonial-button right" onClick={next} aria-label="Next testimonial">
                    <ChevronRight size={45} />
                </button>
            </div>
        </div>
    );
};

export default TestimonialSlider;
