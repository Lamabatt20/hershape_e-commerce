import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

import logo from '../assets/images/logo.png';
import cartIcon from '../assets/icons/Group 1.png';
import userIcon from '../assets/icons/User.png';

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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

    loadUser();
    loadCart();

    
    window.addEventListener("storageUserChanged", loadUser);
    window.addEventListener("storageCartChanged", loadCart);

    return () => {
      window.removeEventListener("storageUserChanged", loadUser);
      window.removeEventListener("storageCartChanged", loadCart);
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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/contact">Contact</Link></li>
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
                <p className="modal-item" onClick={() => navigate("/profile")}>Orders</p>
                <p className="modal-item" onClick={handleLogout}>Logout</p>
              </div>
            )}

            {modalOpen && !user && (
              <div className="user-modal">
                <p className="modal-item" onClick={() => navigate("/login")}>Login</p>
                <p className="modal-item" onClick={() => navigate("/signup")}>Sign Up</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`sidebar-overlay ${menuOpen ? 'show' : ''}`} onClick={closeMenu}></div>

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <span className="close-icon-inside" onClick={closeMenu}>&times;</span>
        <ul>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/shop" onClick={closeMenu}>Shop</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
        </ul>
      </aside>
    </>
  );
}

export default Navbar;
