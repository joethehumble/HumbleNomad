import React, { useState, useEffect } from 'react';
import '../styles/App.css'; // Global app-wide CSS
import LoadingFallback from '../components/LoadingFallback'; // Adjusted the import path

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 1;  // Simulate loading progress
        } else {
          setIsLoadingComplete(true);
          clearInterval(interval); // Stop interval once loading is complete
          return prev;
        }
      });
    }, 30); // Adjust interval speed as needed

    return () => clearInterval(interval);
  }, []);

  // Set fadeOut effect only after loading is complete
  const loadingScreenClass = `loading-screen ${isLoadingComplete ? 'hide' : ''}`;

  return (
    <div className={loadingScreenClass}>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <img className="van-image" src="images/astrovan.png" alt="Van" />
      {!isLoadingComplete && <LoadingFallback />} {/* Show fallback spinner while loading */}
    </div>
  );
};

export default LoadingScreen;
