// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/keyholder-pwa/sw.js').catch(() => {
    console.log('Service Worker registration failed or not available');
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)