import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingFallback from "./components/LoadingFallback";
import Sidebar from './components/Sidebar/Sidebar';
import SearchBar from "./js/SearchBar";
import Header from './js/Header';
import Footer from './js/Footer';
import LoadingScreen from "./js/LoadingScreen";
import HamburgerMenu from "./components/HamburgerMenu/HamburgerMenu";
import Dashboard from "./Pages/Dashboard";
import Campsite from "./Pages/Campsite";
import Favs from "./Pages/Favs";
import Profile from "./Pages/Profile";
import Forums from "./Pages/Forums";
import "./index.css";

const Map = lazy(() => import("./components/Map/Map.js"));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadingComplete(true);
    }, 2500); // Matches the animation duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Loading Screen */}
        {isLoading && <LoadingScreen />}

        {/* Main Content */}
        <div className={`main-content ${loadingComplete ? "visible" : ""}`}>
          <Header />
          <SearchBar />
          <HamburgerMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Sidebar & Backdrop */}
          <div className={`sidebar-backdrop ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Map />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/campsite" element={<Campsite />} />
                <Route path="/Favs" element={<Favs />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
