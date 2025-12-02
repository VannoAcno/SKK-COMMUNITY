console.log("🚀 app.jsx loaded");

import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

console.log("📦 Trying to import LandingPage...");
import LandingPage from './components/LandingPage';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import SignUp1 from './components/pages/register-step/SignUp-1';
import SignUp2 from './components/pages/register-step/SignUp-2';
import SignUp3 from './components/pages/register-step/SignUp-3';
import SignUp4 from './components/pages/register-step/SignUp-4';
import SignUp5 from './components/pages/register-step/SignUp-5';
import Home from './components/pages/Home';
import Kegiatan from './components/pages/Kegiatan';
import Galeri from './components/pages/Galeri';
import Donasi from './components/pages/Donasi';
import Forum from './components/pages/Forum';
import KritikSaran from './components/pages/KritikSaran';
import Profil from './components/pages/Profile';

console.log("✅ LandingPage imported, mounting React...");

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="login" element={<Login />} />
         <Route path="/register/step-1" element={<SignUp1 />} />
         <Route path="/register/step-2" element={<SignUp2 />} />
         <Route path="/register/step-3" element={<SignUp3 />} />
         <Route path="/register/step-4" element={<SignUp4 />} />
         <Route path="/register/step-5" element={<SignUp5 />} />
         <Route path="/home" element={<Home />} />
         <Route path="/kegiatan" element={<Kegiatan />} />
         <Route path="/galeri" element={<Galeri />} />
         <Route path="/donasi" element={<Donasi />} />
         <Route path="/forum" element={<Forum />} />
         <Route path="/kritik-saran" element={<KritikSaran />} />
         <Route path="/profile" element={<Profil />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

console.log("⚛️ ReactDOM.render called");