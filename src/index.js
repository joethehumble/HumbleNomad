import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // Ensure App is imported
// Removed the unused reportWebVitals import
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* Ensure App component is rendered */}
  </React.StrictMode>
);

// If you ever want to measure performance, uncomment this:
// reportWebVitals(console.log);
