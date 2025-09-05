import React from 'react';
import './HeroSection.css';

import woman1 from '../assets/images/w1.webp';
import woman2 from '../assets/images/w2.webp';
import heroBg from '../assets/images/heros1.png'; 
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <>
      <section className="hero-section">
        <img src={heroBg} alt="Background" className="hero-bg-image" /> 

        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
                <h1>Shape Your Confidence</h1>
                <p className="arabic-sub">
                    Feel comfortable and beautiful with Her Shape shaper, designed for all day wear
                </p>
                <button className="hero-btn"onClick={() => navigate("/Shop")}>SHOP NOW</button>
                </div>

            <div className="hero-images">
              <img src={woman1} alt="Woman 1" className="hero-img oval" />
              <img src={woman2} alt="Woman 2" className="hero-img oval second" />
            </div>
          </div>
        </div>
      </section>

    
      <div className="hero-marquee">
        <span>Ready to be the best version of yourself</span>
        <span>Ready to be the best version of yourself</span>
      </div>
    </>
  );
}

export default HeroSection;
