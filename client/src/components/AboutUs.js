import React from 'react';
import './AboutUs.css';

const AboutUs = () => (
  <section className="about-section">
    <div className="about-hero">
      <h1>About Us</h1>
      <p className="about-tagline">Connecting pets with loving families, one adoption at a time.</p>
    </div>
    <div className="about-content-centered">
      <div className="about-story-card">
        <div className="about-story-centered">
          <h2>Our Mission</h2>
          <div className="accent-bar"></div>
          <p>
            At Pet Adoption El-Mammar, our mission is to give every animal a second chance at happiness. We believe every pet deserves a loving home and every person deserves the joy of a loyal companion. Our dedicated team works tirelessly to rescue, care for, and match pets with their perfect families.
          </p>
          <h2>Our Story</h2>
          <div className="accent-bar"></div>
          <p>
            Founded in 2025, our store has helped over 200 pets find their forever homes. We started as a small group of animal lovers and have grown into a vibrant community dedicated to animal welfare, education, and support for adopters.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs;
