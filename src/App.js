import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading screen
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = (pageId) => {
    console.log(`Navigating to ${pageId}`);
    // You can set your page logic here, such as state to control the page displayed
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <img src={logo} className="loading-logo" alt="Humble Nomad Logo" />
        <h1 className="loading-text">HUMBLE NOMAD</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <nav className="top-nav">
        <input 
          type="text" 
          id="top-search-bar" 
          className="search-bar" 
          placeholder="Search for a campsite..." 
        />
      </nav>
    
      <main>
        <div className="nav-bar">
          <div 
            id="map-btn" 
            className="page"
            onClick={() => handleButtonClick('campsite')}
          >
            🏕️ <span>Campsite</span>
          </div>

          <div 
            id="favs-btn" 
            className="page"
            onClick={() => handleButtonClick('favs')}
          >
            ❤️ <span>Favs</span>
          </div>

          <div 
            id="dashboard-btn" 
            className="page"
            onClick={() => handleButtonClick('dashboard')}
          >
            🛖 <span>Dashboard</span>
          </div>

          <div 
            id="forums-btn" 
            className="page"
            onClick={() => handleButtonClick('forums')}
          >
            🗯️ <span>Forums</span>
          </div>

          <div 
            id="profile-btn" 
            className="page"
            onClick={() => handleButtonClick('profile')}
          >
            🪪 <span>Profile</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
