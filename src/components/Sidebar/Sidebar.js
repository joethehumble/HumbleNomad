import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-title">HumbleNomad</div>

      <Link to="/campsite" className="sidebar-link" onClick={toggleSidebar}>
        🏕️ <span>Campsite</span>
      </Link>

      <Link to="/favorites" className="sidebar-link" onClick={toggleSidebar}>
        ❤️ <span>Favs</span>
      </Link>

      <Link to="/dashboard" className="sidebar-link" onClick={toggleSidebar}>
        🛖 <span>Dashboard</span>
      </Link>

      <Link to="/forums" className="sidebar-link" onClick={toggleSidebar}>
        🗯️ <span>Forums</span>
      </Link>

      <Link to="/profile" className="sidebar-link" onClick={toggleSidebar}>
        🪪 <span>Profile</span>
      </Link>

      <button className="close-btn" onClick={toggleSidebar}>×</button>
    </div>
  );
};

export default Sidebar;
