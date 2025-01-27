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
      <div className="top-nav">
        <input
          type="text"
          id="top-search-bar"
          className="search-bar"
          placeholder="Search for a campsite..."
        />
      </div>

      <div class="nav-bar">
        <div id="map-btn" class="page">
            🏕️ <span>Campsite</span>
        </div>

        <div id="favs-btn" onclick="setPageId('favs-page'); setActive(this);">
            ❤️ <span>Favs</span>
        </div>

        <div id="dashboard-btn" class="page">
            🛖 <span>Dashboard</span>
        </div>

        <div id="forums-btn" class="page">
            🗯️ <span>Forums</span>
        </div>

        <div id="profile-btn" class="page">      
            🪪 <span>Profile</span>
        </div>
      </div>
    </div>
  );
}

export default App;
