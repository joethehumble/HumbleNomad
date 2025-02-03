import React from "react";
import "../styles/Spinner.css"; // Import the spinner styles

function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="spinner"></div>
    </div>
  );
}

export default LoadingFallback;
