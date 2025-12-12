console.log("🚀 app.jsx loaded");

import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ✅ Import ProtectedRoute
import ProtectedRoute from './components/shared/ProtectedRoute';

console.log("📦 Trying to import LandingPage...");
import LandingPage from './components/LandingPage';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import SignUp1 from './components/pages/register-flow/SignUp-1';
import SignUp2 from './components/pages/register-flow/SignUp-2';
import SignUp3 from './components/pages/register-flow/SignUp-3';
import SignUp4 from './components/pages/register-flow/SignUp-4';
import SignUp5 from './components/pages/register-flow/SignUp-5';
import Home from './components/pages/Home';
import Kegiatan from './components/pages/Kegiatan';
import Galeri from './components/pages/Galeri';
import Donasi from './components/pages/Donasi';
import Forum from './components/pages/Forum';
import KritikSaran from './components/pages/KritikSaran';
import Profile from './components/pages/Profile';
import DonasiDetail from './components/pages/donasi-flow/DonasiDetail';
import EditProfile from './components/pages/profile-flow/EditProfile';
import GantiPassword from './components/pages/profile-flow/GantiPassword';
import DashboardAdmin from './components/admin-pages/DashboardAdmin';
import KegiatanAdmin from './components/admin-pages/Kegiatan/KegiatanAdmin';
import DonasiAdmin from './components/admin-pages/Donasi/DonasiAdmin';
import EditAdminProfile from './components/admin-pages/EditAdminProfile';
import ForumAdmin from './components/admin-pages/Forum/ForumAdmin';
import GaleriAdmin from './components/admin-pages/Galeri/GaleriAdmin';
import RenunganAdmin from './components/admin-pages/Renungan/RenunganAdmin';

console.log("✅ LandingPage imported, mounting React...");

// ✅ Fungsi pembungkus untuk rute terlindungi
const Protected = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return window.location.pathname === '/login' ? children : window.location.replace('/login');
  }
  return children;
};

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/step-1" element={<SignUp1 />} />
        <Route path="/register/step-2" element={<SignUp2 />} />
        <Route path="/register/step-3" element={<SignUp3 />} />
        <Route path="/register/step-4" element={<SignUp4 />} />
        <Route path="/register/step-5" element={<SignUp5 />} />

        {/* Rute Terlindungi — dibungkus dengan Protected */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/kegiatan" element={<ProtectedRoute><Kegiatan /></ProtectedRoute>} />
        <Route path="/galeri" element={<ProtectedRoute><Galeri /></ProtectedRoute>} />
        <Route path="/donasi" element={<ProtectedRoute><Donasi /></ProtectedRoute>} />
        <Route path="/donasi/:id" element={<ProtectedRoute><DonasiDetail /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
        <Route path="/kritik-saran" element={<ProtectedRoute><KritikSaran /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/profile/ganti-password" element={<ProtectedRoute><GantiPassword /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/admin/kegiatan" element={<ProtectedRoute><KegiatanAdmin /></ProtectedRoute>} />
        <Route path="/admin/donasi" element={<ProtectedRoute><DonasiAdmin /></ProtectedRoute>} />
        <Route path="/admin/renungan" element={<ProtectedRoute><RenunganAdmin /></ProtectedRoute>} />
        <Route path="/admin/galeri" element={<ProtectedRoute><GaleriAdmin /></ProtectedRoute>} />
        <Route path="/admin/forum" element={<ProtectedRoute><ForumAdmin /></ProtectedRoute>} />
        <Route path="/admin/profile/edit" element={<ProtectedRoute><EditAdminProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

console.log("⚛️ ReactDOM.render called");