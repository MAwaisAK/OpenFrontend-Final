import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    
    <footer id="footer" className="footer position-relative light-background">
      <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
/>

      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <a href="/" className="d-flex align-items-center">
            <Image  src="/assets/img/footer.png" width={150} height={100}/>

            </a>
<div className="footer-contact pt-3">
  <p className="mt-3">
    <strong>Phone:</strong>{" "}
    <a href="tel:+13528204044">+1 (352) 820-4044</a>
  </p>
  <p>
    <strong>Email:</strong>{" "}
    <a href="mailto:info@openpreneurs.business">
      info@openpreneurs.business
    </a>
  </p>
</div>

<div className="social-links d-flex mt-4">
  <a
    href="https://www.instagram.com/0penpreneurs?igsh=d2RhZTBsdXViOHNj"
    target="_blank"
    rel="noopener noreferrer"
    className="me-3"
  >
    <i className="bi bi-instagram"></i>
  </a>

  <a
    href="https://www.linkedin.com/showcase/openpreneurs/"
    target="_blank"
    rel="noopener noreferrer"
    className="me-3"
  >
    <i className="bi bi-linkedin"></i>
  </a>

  <a
    href="https://www.threads.net/@0penpreneurs"
    target="_blank"
    rel="noopener noreferrer"
  >
    <i className="fab fa-threads"></i>
  </a>
</div>

          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#about">About us</a></li>
              <li><a href="#features">Services</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Signup</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Our Features</h4>
            <ul>
              <li><a href="#features">Lift Ai</a></li>
              <li><a href="#features">Entrepreneur Hub</a></li>
              <li><a href="#features">Courses</a></li>
            </ul>
          </div>

          
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><a href="/terms-conditions">Terms & Conditions</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p>
          © <span>Copyright 2025</span> <strong className="px-1 sitename">OpEn</strong> <span>All Rights Reserved</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
