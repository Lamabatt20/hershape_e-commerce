import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

import logo from '../assets/images/logo.png';
import cartIcon from '../assets/icons/Group 1.png';
import userIcon from '../assets/icons/User.png';
import globeIcon from '../assets/icons/icons8-global-language-50.png'; 

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [language, setLanguage] = useState('en'); 

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    };

    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    const loadLanguage = () => {
      const lang = localStorage.getItem('language') || 'en';
      setLanguage(lang);
    };

    loadUser();
    loadCart();
    loadLanguage();

    window.addEventListener("storageUserChanged", loadUser);
    window.addEventListener("storageCartChanged", loadCart);
    window.addEventListener("storageLanguageChanged", loadLanguage);

    return () => {
      window.removeEventListener("storageUserChanged", loadUser);
      window.removeEventListener("storageCartChanged", loadCart);
      window.removeEventListener("storageLanguageChanged", loadLanguage);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart'); 
    setUser(null);
    setModalOpen(false);
    window.dispatchEvent(new Event("storageUserChanged"));
    window.dispatchEvent(new Event("storageCartChanged"));
    navigate('/login');
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.dispatchEvent(new Event("storageLanguageChanged"));
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-menu-icon" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Her Shape Logo" />
        </div>

        <ul className="navbar-links">
          <li><Link to="/">{language === 'en' ? 'Home' : 'الرئيسية'}</Link></li>
          <li><Link to="/shop">{language === 'en' ? 'Shop' : 'المتجر'}</Link></li>
          <li><Link to="/contact">{language === 'en' ? 'Contact' : 'تواصل معنا'}</Link></li>
        </ul>

        <div className="navbar-icons">
          <div className="cart-icon">
            <Link to="/cart">
              <img src={cartIcon} alt="Cart" className="icon-img" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>

          <div className="user-modal-container">
            <img
              src={userIcon}
              alt="User"
              className="icon-img"
              style={{ cursor: 'pointer' }}
              onClick={() => setModalOpen(!modalOpen)}
            />

            {modalOpen && user && (
              <div className="user-modal">
                <p className="modal-item" onClick={() => navigate("/profile")}>
                  {language === 'en' ? 'Orders' : 'طلبات'}
                </p>
                <p className="modal-item" onClick={handleLogout}>
                  {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                </p>
              </div>
            )}

            {modalOpen && !user && (
              <div className="user-modal">
                <p className="modal-item" onClick={() => navigate("/login")}>
                  {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                </p>
                <p className="modal-item" onClick={() => navigate("/signup")}>
                  {language === 'en' ? 'Sign Up' : 'إنشاء حساب'}
                </p>
              </div>
            )}
          </div>

          <div className="language-selector">
          <img src={globeIcon} alt="Language" className="globe-icon" />
          <span className="language-text" style={{ display: 'block', marginBottom: '4px' }}>
            {language.toUpperCase()}
          </span>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="language-dropdown"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
        </div>

        </div>
      </nav>

      <div className={`sidebar-overlay ${menuOpen ? 'show' : ''}`} onClick={closeMenu}></div>

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <span className="close-icon-inside" onClick={closeMenu}>&times;</span>
        <ul>
          <li><Link to="/" onClick={closeMenu}>{language === 'en' ? 'Home' : 'الرئيسية'}</Link></li>
          <li><Link to="/shop" onClick={closeMenu}>{language === 'en' ? 'Shop' : 'المتجر'}</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>{language === 'en' ? 'Contact' : 'تواصل معنا'}</Link></li>
        </ul>
      </aside>
    </>
  );
}

export default Navbar;
