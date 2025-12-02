console.log("🚀 app.jsx loaded");

import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

console.log("📦 Trying to import LandingPage...");
import LandingPage from './components/LandingPage';
import Register from './components/pages/Register';

console.log("✅ LandingPage imported, mounting React...");

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

console.log("⚛️ ReactDOM.render called");