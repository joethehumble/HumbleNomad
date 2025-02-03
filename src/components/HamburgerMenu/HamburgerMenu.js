import React from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = ({ isOpen, toggleSidebar }) => {
  const handleClick = (event) => {
    event.stopPropagation();  // Prevent click propagation to avoid unwanted sidebar opening
    toggleSidebar();  // Toggle sidebar state
  };

  return (
    <div className="hamburger-menu">
      {/* Hamburger Icon (visible when sidebar is closed) */}
      <div className={`hamburger-Icon ${!isOpen ? 'show' : ''}`} onClick={handleClick}>
        {/* Humble Nomad Logo */}
        <img src="/images/HamburgerIcon.png" alt="Humble Nomad Logo" />
      </div>
    </div>
  );
};

export default HamburgerMenu;
