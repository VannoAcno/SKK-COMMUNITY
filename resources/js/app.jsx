// resources/js/app.jsx

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
import KegiatanDetail from './components/pages/kegiatan-flow/KegiatanDetail';
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
import TambahKegiatan from './components/admin-pages/Kegiatan/TambahKegiatan';
import EditKegiatan from './components/admin-pages/Kegiatan/EditKegiatan';
import DonasiAdmin from './components/admin-pages/Donasi/DonasiAdmin';
import EditAdminProfile from './components/admin-pages/EditAdminProfile';
import ForumAdmin from './components/admin-pages/Forum/ForumAdmin'; // <- Sudah ada
import RenunganAdmin from './components/admin-pages/Renungan/RenunganAdmin';
import DaftarPesertaKegiatan from './components/admin-pages/Kegiatan/DaftarPesertaKegiatan';
import TambahRenungan from './components/admin-pages/Renungan/TambahRenungan';
import EditRenungan from './components/admin-pages/Renungan/EditRenungan';
import ForumDetail from './components/pages/forum-flow/ForumDetail'; // <- Halaman detail user
import TambahTopik from './components/pages/forum-flow/TambahTopik'; // <- Halaman tambah user

// ✅ Import komponen album
import TambahAlbum from './components/admin-pages/Album/TambahAlbum';
import EditAlbum from './components/admin-pages/Album/EditAlbum';
import AlbumDetail from './components/admin-pages/Album/AlbumDetail';
import UploadFoto from './components/admin-pages/Album/UploadFoto';
import AlbumAdmin from './components/admin-pages/Album/AlbumAdmin';
import AlbumViewer from './components/pages/album-flow/AlbumViewer';
import TotalUsers from './components/admin-pages/TotalUsers';
import KampanyeDetail from './components/admin-pages/Donasi/KampanyeDetail';
import TambahKampanye from './components/admin-pages/Donasi/TambahKampanye';
import EditKampanye from './components/admin-pages/Donasi/EditKampanye';
import TransaksiKampanye from './components/admin-pages/Donasi/TransaksiKampanye';
import DonasiPerBulan from './components/admin-pages/Donasi/DonasiPerBulan';
import RiwayatDonasi from './components/pages/donasi-flow/RiwayatDonasi';
import TransaksiDetail from './components/admin-pages/Donasi/TransaksiDetail';
import DonasiForm from './components/pages/donasi-flow/DonasiForm';

console.log("✅ LandingPage imported, mounting React...");

// ✅ Fungsi pembungkus untuk rute terlindungi
const Protected = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

// 🔧 Fungsi untuk parsing query params (jika diperlukan di masa depan)
// const useQuery = () => { ... };

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

        {/* Rute Terlindungi — dibungkus dengan ProtectedRoute */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/kegiatan" element={<ProtectedRoute><Kegiatan /></ProtectedRoute>} />
        <Route path="/kegiatan/:id" element={<ProtectedRoute><KegiatanDetail /></ProtectedRoute>} />
        <Route path="/galeri" element={<ProtectedRoute><Galeri /></ProtectedRoute>} />
        <Route path="/donasi" element={<ProtectedRoute><Donasi /></ProtectedRoute>} />
        <Route path="/donasi/:id" element={<ProtectedRoute><DonasiDetail /></ProtectedRoute>} />
        <Route path="/donasi/form" element={<ProtectedRoute><DonasiForm /></ProtectedRoute>} />
        <Route path="/riwayat-donasi" element={<ProtectedRoute><RiwayatDonasi /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
        <Route path="/forum/:id" element={<ProtectedRoute><ForumDetail /></ProtectedRoute>} />
        <Route path="/forum/tambah" element={<ProtectedRoute><TambahTopik /></ProtectedRoute>} />
        <Route path="/kritik-saran" element={<ProtectedRoute><KritikSaran /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/profile/ganti-password" element={<ProtectedRoute><GantiPassword /></ProtectedRoute>} />

        {/* === 🔧 RUTE ADMIN === */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><TotalUsers /></ProtectedRoute>} />
        <Route path="/admin/kegiatans" element={<ProtectedRoute><KegiatanAdmin /></ProtectedRoute>} />
        <Route path="/admin/kegiatans/:id/peserta" element={<ProtectedRoute><DaftarPesertaKegiatan /></ProtectedRoute>} />
        <Route path="/admin/kegiatans/tambah" element={<ProtectedRoute><TambahKegiatan /></ProtectedRoute>} />
        <Route path="/admin/kegiatans/:id/edit" element={<ProtectedRoute><EditKegiatan /></ProtectedRoute>} />

        {/* === 🔧 RUTE DONASI ADMIN === */}
        <Route path="/admin/donasis" element={<ProtectedRoute><DonasiAdmin /></ProtectedRoute>} />
        <Route path="/admin/donasis/perbulan" element={<ProtectedRoute><DonasiPerBulan /></ProtectedRoute>} />
        <Route path="/admin/donasis/:id/detail" element={<ProtectedRoute><TransaksiDetail /></ProtectedRoute>} />
        <Route path="/admin/donasi/kampanye/:id" element={<ProtectedRoute><KampanyeDetail /></ProtectedRoute>} />
        <Route path="/admin/donasi/kampanye/:id/transaksi" element={<ProtectedRoute><TransaksiKampanye /></ProtectedRoute>} />
        <Route path="/admin/donasi/kampanye/tambah" element={<ProtectedRoute><TambahKampanye /></ProtectedRoute>} />
        <Route path="/admin/donasi/kampanye/:id/edit" element={<ProtectedRoute><EditKampanye /></ProtectedRoute>} />

        {/* === 🔧 RUTE FORUM ADMIN (DITAMBAHKAN) === */}
        <Route path="/admin/forums" element={<ProtectedRoute><ForumAdmin /></ProtectedRoute>} />

        {/* === 🔧 RUTE RENUNGAN ADMIN === */}
        <Route path="/admin/renungans" element={<ProtectedRoute><RenunganAdmin /></ProtectedRoute>} />
        <Route path="/admin/renungans/tambah" element={<ProtectedRoute><TambahRenungan /></ProtectedRoute>} />
        <Route path="/admin/renungans/:id/edit" element={<ProtectedRoute><EditRenungan /></ProtectedRoute>} />

        {/* === 🔧 RUTE PROFIL ADMIN === */}
        <Route path="/admin/profile/edit" element={<ProtectedRoute><EditAdminProfile /></ProtectedRoute>} />

        {/* === 🔧 RUTE ALBUM ADMIN === */}
        <Route path="/galeri/album/:albumId" element={<ProtectedRoute><AlbumViewer /></ProtectedRoute>} />
        <Route path="/admin/galeris" element={<ProtectedRoute><AlbumAdmin /></ProtectedRoute>} />
        <Route path="/admin/albums/tambah" element={<ProtectedRoute><TambahAlbum /></ProtectedRoute>} />
        <Route path="/admin/albums/:albumId/edit" element={<ProtectedRoute><EditAlbum /></ProtectedRoute>} />
        <Route path="/admin/albums/:albumId" element={<ProtectedRoute><AlbumDetail /></ProtectedRoute>} />
        <Route path="/admin/albums/:albumId/upload" element={<ProtectedRoute><UploadFoto /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

console.log("⚛️ ReactDOM.render called");