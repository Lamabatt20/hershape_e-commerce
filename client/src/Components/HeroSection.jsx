import React, { useEffect, useState } from 'react';
import './HeroSection.css';

import woman1 from '../assets/images/w1.webp';
import woman2 from '../assets/images/w2.webp';
import heroBg from '../assets/images/heros1.png';
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'en';
    setLanguage(lang);
    const handleLanguageChange = () => {
      const updatedLang = localStorage.getItem('language') || 'en';
      setLanguage(updatedLang);
    };
    window.addEventListener("storageLanguageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("storageLanguageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <>
      <section className="hero-section">
        <img src={heroBg} alt="Background" className="hero-bg-image" />

        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                {language === 'en' ? 'Shape Your Confidence' : 'صمّمي ثقتك بنفسك'}
              </h1>
              <p className="arabic-sub">
                {language === 'en'
                  ? 'Feel comfortable and beautiful with Her Shape shaper, designed for all day wear'
                  : '    اشعري بالراحة والجمال مع مشد هير شيب المصمم لارتداء يدوم طوال اليوم'}
              </p>
              <button className="hero-btn" onClick={() => navigate("/shop")}>
                {language === 'en' ? 'SHOP NOW' : 'تسوّقي الآن'}
              </button>
            </div>

            <div className="hero-images">
              <img src={woman1} alt="Woman 1" className="hero-img oval" />
              <img src={woman2} alt="Woman 2" className="hero-img oval second" />
            </div>
          </div>
        </div>
      </section>

      <div className="hero-marquee">
        <span>
          {language === 'en'
            ? 'Ready to be the best version of yourself'
            : 'هل أنتِ مستعدة لتكوني أفضل نسخة من نفسك؟'}
        </span>
        <span>
          {language === 'en'
            ? 'Ready to be the best version of yourself'
            : 'هل أنتِ مستعدة لتكوني أفضل نسخة من نفسك؟'}
        </span>
      </div>
    </>
  );
}

export default HeroSection;
