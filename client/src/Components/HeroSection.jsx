import React, { useEffect, useState } from 'react';
import './HeroSection.css';
import woman1 from '../assets/images/W1.png';
import woman2 from '../assets/images/s.png';
import { useNavigate } from "react-router-dom";
import friendsIcon from '../assets/images/i11.png';
import happyIcon from '../assets/images/i12.png';
import trustIcon from '../assets/images/i13.png';

const slides = [
  {
    titleEn: 'Shape Your Confidence',
    titleAr: 'صمّمي ثقتك بنفسك',
    descEn: 'Feel comfortable and beautiful with HerShape shaper, designed for all day wear',
    descAr: <>اشعري بالراحة والجمال مع <span dir="ltr">HerShape</span> المصمم لارتداء يدوم طوال اليوم</>,
    img: woman1,
    imgPosition: 'right',
  },
  {
  titleEn: 'Features hershape shaper',
  titleAr: <> <span dir="ltr">HerShape</span> مميزات مشدات </>,
  bulletEn: [
    'Waist shaping',
    'Posture correction',
    'Postpartum recovery',
  ],
  bulletAr: [
    'تحديد الخصر',
    'تصحيح وضعية الظهر',
    'التعافي بعد الولادة',
  ],
  img: woman2,
  imgPosition: 'left',
  },
];

function HeroSection() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const slideDuration = 2000;

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    setLanguage(storedLang);
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "en");
    };
    window.addEventListener("storageLanguageChanged", handleLangChange);
    return () =>
      window.removeEventListener("storageLanguageChanged", handleLangChange);
  }, []);

  useEffect(() => {
    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress((elapsed / slideDuration) * 100);

      if (elapsed >= slideDuration) {
        startTime = Date.now();
        setProgress(0);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay"></div>

        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''} slide-${index + 1}`}
            style={{ flexDirection: slide.imgPosition === 'left' ? 'row-reverse' : 'row' }}
          >
            <div className={`hero-text hero-text-${index + 1}`} style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
              <h1>{language === 'en' ? slide.titleEn : slide.titleAr}</h1>

              {slide.bulletEn ? (
              <>
                <ul className="hero-bullets">
                  {(language === 'en' ? slide.bulletEn : slide.bulletAr).map((item, i) => {
                    
                    const iconsOrder = [friendsIcon, trustIcon, happyIcon];
                    return (
                      <li key={i}>
                        {i === 0 ? <img src={iconsOrder[0]} alt="icon" className="bullet-icon" /> : null}
                        {i === 1 ? <img src={iconsOrder[2]} alt="icon" className="bullet-icon" /> : null}
                        {i === 2 ? <img src={iconsOrder[1]} alt="icon" className="bullet-icon" /> : null}
                        <span className="bullet-text">{item}</span>
                      </li>
                    );
                  })}
                </ul>

                <button 
                  className={`hero-btn hero-btn-${index + 1} explore-btn`} 
                  onClick={() => navigate("/shop")}
                >
                  {language === 'en' ? 'SHOP NOW' : 'تسوّقي الآن'}
                </button>
              </>
            ) : (
              <p className={`arabic-sub arabic-sub-${index + 1}`}>
                {language === 'en' ? slide.descEn : slide.descAr}
              </p>
            )}

              {index === 0 && (
                <button className={`hero-btn hero-btn-${index + 1}`} onClick={() => navigate("/shop")}>
                  {language === 'en' ? 'SHOP NOW' : 'تسوّقي الآن'}
                </button>
              )}
            </div>

            <div className={`hero-image-container hero-image-${index + 1}`}>
              <img src={slide.img} alt="Hero" className={`hero-img hero-img-${index + 1}`} />
            </div>
          </div>
        ))}

       
        <div className="hero-dots">
          {slides.map((_, index) => (
            <div key={index} className="dot">
              <div
                className={`dot-progress ${currentSlide === index ? 'active' : ''}`}
                style={{ width: currentSlide === index ? `${progress}%` : '0%' }}
              ></div>
            </div>
          ))}
        </div>
      </section>

    
      <div className={`hero-marquee ${language === "ar" ? "rtl" : ""}`}>
        <span>{language === "en" ? "Ready to be the best version of yourself" : "هل أنتِ مستعدة لتكوني أفضل نسخة من نفسك؟"}</span>
        <span>{language === "en" ? "Ready to be the best version of yourself" : "هل أنتِ مستعدة لتكوني أفضل نسخة من نفسك؟"}</span>
      </div>
    </>
  );
}

export default HeroSection;
