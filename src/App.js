import React, { useState, useEffect, lazy, Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";

// Lazy-load the Map component
const Map = lazy(() => import("./map"));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [layersMenuOpen, setLayersMenuOpen] = useState(false); // State for layers menu

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate a 3-second loading delay
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = (pageId) => {
    console.log(`Navigating to ${pageId}`);
  };

  const toggleLayersMenu = () => {
    setLayersMenuOpen(!layersMenuOpen);
  };

  // If the app is still loading, show the loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <img src={logo} className="loading-logo" alt="Humble Nomad Logo" />
        <h1 className="loading-text">HUMBLE NOMAD</h1>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <input
          type="text"
          id="top-search-bar"
          className="search-bar"
          placeholder="Search for a campsite..."
        />
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Suspense fallback={<div>Loading Map...</div>}>
          <Map layersMenuOpen={layersMenuOpen} toggleLayersMenu={toggleLayersMenu} />
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <footer className="nav-bar">
        <div
          id="map-btn"
          className="page"
          onClick={() => handleButtonClick("campsite")}
        >
          <img src="images/nav-bar/campsite.png" alt="Map" />
          <span>CAMPSITE</span>
        </div>
        <div
          id="favs-btn"
          className="page"
          onClick={() => handleButtonClick("favs")}
        >
          <img src="images/nav-bar/favs.png" alt="Favorites" />
          <span>FAVS</span>
        </div>
        <div
          id="dashboard-btn"
          className="page"
          onClick={() => handleButtonClick("dashboard")}
        >
          <img src="images/nav-bar/dashboard.png" alt="Dashboard" />
          <span>DASHBOARD</span>
        </div>
        <div
          id="forums-btn"
          className="page"
          onClick={() => handleButtonClick("forums")}
        >
          <img src="images/nav-bar/forums.png" alt="Forums" />
          <span>FORUMS</span>
        </div>
        <div
          id="profile-btn"
          className="page"
          onClick={() => handleButtonClick("profile")}
        >
          <img src="images/nav-bar/profile.png" alt="Profile" />
          <span>PROFILE</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
