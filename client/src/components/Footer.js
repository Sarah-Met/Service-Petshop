import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@elmammar.com</p>
          <p>Phone: +201088364791</p>
          <p>Address: 123 Nile Road, Zamalek, Cairo</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>Facebook: @elmammar_petstore</p>
          <p>Instagram: @elmammar_pets</p>
          <p>Website: www.elmammarpetshop.com</p>
        </div>
        <div className="footer-section">
          <h3>Working Hours</h3>
          <p>Sunday - Thursday: 9:00 AM - 10:00 PM</p>
          <p>Saturday: 12:00 PM - 6:00 PM</p>
          <p>Friday: Closed</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 El-Mammar. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
