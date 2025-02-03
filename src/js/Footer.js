import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation
import "../styles/App.css";

const Footer = () => {
  const location = useLocation(); // Get the current page location

  return (
    <footer className="nav-bar">
      <Link 
        to="/campsite" 
        className={`page ${location.pathname === "/campsite" ? "active" : ""}`}
        aria-label="Go to Campsite page"
      >
        🏕️ <span>Campsite</span>
      </Link>

      <Link 
        to="/favorites" 
        className={`page ${location.pathname === "/favorites" ? "active" : ""}`}
        aria-label="Go to Favorites page"
      >
        ❤️ <span>Favs</span>
      </Link>

      <Link 
        to="/dashboard" 
        className={`page ${location.pathname === "/dashboard" ? "active" : ""}`}
        aria-label="Go to Dashboard"
      >
        🛖 <span>Dashboard</span>
      </Link>

      <Link 
        to="/forums" 
        className={`page ${location.pathname === "/forums" ? "active" : ""}`}
        aria-label="Go to Forums"
      >
        🗯️ <span>Forums</span>
      </Link>

      <Link 
        to="/profile" 
        className={`page ${location.pathname === "/profile" ? "active" : ""}`}
        aria-label="Go to Profile"
      >
        🪪 <span>Profile</span>
      </Link>
    </footer>
  );
};

export default Footer;
