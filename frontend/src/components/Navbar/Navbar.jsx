import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">PropertyChain</Link>
      </div>
      
      <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        <Link to="/buy" className={isActive('/buy')} onClick={() => setMenuOpen(false)}>Buy</Link>
        <Link to="/sell" className={isActive('/sell')} onClick={() => setMenuOpen(false)}>Sell</Link>
        <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>Profile</Link>
        <Link to="/verified" className={isActive('/verified')} onClick={() => setMenuOpen(false)}>Verified Contracts</Link>
        <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;