"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swiper from "swiper";
import '../../styles/vendor/swiper/swiper-bundle.min.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      new Swiper(".init-swiper", {
        loop: true,
        speed: 600,
        autoplay: { delay: 5000 },
        slidesPerView: "auto",
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 40 },
          1200: { slidesPerView: 2, spaceBetween: 20 },
        },
      });
    }
  }, [testimonials]);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/get-all`);
      setTestimonials(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials.");
      setLoading(false);
    }
  };

  return (
    <section id="testimonials" className="testimonials section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Testimonials</h2>
        <p>What our clients say</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {loading ? (
          <p>Loading testimonials...</p>
        ) : error ? (
          <p>{error}</p>
        ) : testimonials.length === 0 ? (
          <p>No testimonials available.</p>
        ) : (
          <div className="swiper init-swiper">
            <div className="swiper-wrapper">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="swiper-slide">
                  <div className="testimonial-wrap">
                    <div className="testimonial-item">
                      {testimonial.img && (
                        <img
                          src={testimonial.img}
                          className="testimonial-img"
                          alt={testimonial.name}
                        />
                      )}
                      <h3>{testimonial.name}</h3>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>{testimonial.testimonal}</span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
