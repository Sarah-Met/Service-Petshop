import React from 'react';
import './AdoptionProcess.css';
import choosePetIcon from '../images/adoption-process/choose-pet-icon.png';
import formIcon from '../images/adoption-process/form-icon.png';
import welcomeHomeIcon from '../images/adoption-process/welcome-home-icon.png';

const AdoptionProcess = () => (
  <section className="adoption-process-section" id="adoption-process">
    <h2 className="adoption-title">Adoption Process in El-Mammar!</h2>
    <p className="adoption-subtitle">
      Adopting our pets is as easy as 1-2-3. This roadmap will guide you every step of the way to finding your new best friend.
    </p>
    <div className="adoption-cards">
      <div className="adoption-card card-gray">
        <div className="adoption-step-circle">1</div>
        <h3>Choose your pet</h3>
        <p>Explore our list of adorable pets looking for a loving home. Filter by type, breed, age, and more to find the perfect match for your lifestyle.</p>
        <div className="adoption-icon">
          <img src={choosePetIcon} alt="Choose your pet" />
        </div>
      </div>
      <div className="adoption-card card-red">
        <div className="adoption-step-circle">2</div>
        <h3>Fill out our form!</h3>
        <p>Once you've found your future furry friend, fill out a quick and simple adoption application. We'll review it and contact you for the next steps.</p>
        <div className="adoption-icon">
          <img src={formIcon} alt="Fill out form" />
        </div>
      </div>
      <div className="adoption-card card-yellow">
        <div className="adoption-step-circle">3</div>
        <h3>Welcome Home!</h3>
        <p>After approval, you'll be ready to bring your new companion home! We'll provide you with all the info you need for a smooth transition.</p>
        <div className="adoption-icon">
          <img src={welcomeHomeIcon} alt="Welcome home" />
        </div>
      </div>
    </div>
  </section>
);

export default AdoptionProcess;
