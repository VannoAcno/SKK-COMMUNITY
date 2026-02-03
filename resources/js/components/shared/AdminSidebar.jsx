// resources/js/components/shared/AdminSidebar.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, Heart, MessageCircle, User, LogOut, Target, Camera, BookOpen } from 'lucide-react'; // Tambahkan ikon baru
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

// Definisikan item navigasi admin
const navItems = [
  { name: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
  { name: 'Kegiatan', icon: Calendar, path: '/admin/kegiatans' },
  { name: 'Donasi', icon: Heart, path: '/admin/donasis' },
  { name: 'Galeri', icon: Camera, path: '/admin/galeris' },
  { name: 'Forum', icon: MessageCircle, path: '/admin/forums' },
  { name: 'Renungan', icon: BookOpen, path: '/admin/renungans' }, // Ganti Heart ke BookOpen untuk Renungan
];

export default function AdminSidebar({ admin }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ganti confirm dengan Swal
    Swal.fire({
      title: 'Yakin ingin logout?',
      text: "Anda akan keluar dari akun admin.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FACC15', // Warna kuning utama
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        // Lakukan proses logout
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // alert('Anda telah logout.'); // ❌ GANTI INI
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Anda telah logout.',
          confirmButtonColor: '#FACC15',
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };

  if (!admin) {
    return <div className="w-64 h-full bg-[#F9FAFB] border-r border-[#FDE68A]">Memuat...</div>;
  }

  return (
    <Card className="border-0 shadow-sm h-full bg-white border border-[#FEF9C3]"> {/* Gaya card */}
      <CardContent className="p-4 space-y-2">
        {/* Profil Admin */}
        <Link to="/admin/profile/edit" className="block">
          <div className="flex items-center gap-3 p-3 bg-[#FEF9C3]/50 rounded-lg border border-[#FDE68A] hover:bg-[#FEF9C3] transition-colors"> {/* Gaya profil */}
            <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center overflow-hidden border border-[#FDE68A]">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt="Avatar Admin"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#FACC15] flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-[#374151] text-sm line-clamp-1">{admin.full_name}</p>
              <p className="text-xs text-[#6B7280] truncate">{admin.email}</p>
            </div>
          </div>
        </Link>

        {/* Garis Pemisah */}
        <hr className="border-[#FEF9C3] my-2" />

        {/* Menu Navigasi */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path); // Gunakan startsWith agar submenu aktif jika path lebih dalam

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#FACC15] text-black font-medium shadow-sm' // Gaya aktif
                    : 'text-[#374151] hover:bg-[#FEF9C3] hover:text-[#374151]' // Gaya non-aktif
                }`}
              >
                <Icon size={18} className={isActive ? 'text-black' : 'text-[#374151]'} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Garis Pemisah */}
        <hr className="border-[#FEF9C3] my-2" />

        {/* Tombol Logout */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] mt-2 flex items-center gap-3 font-medium text-sm" // Gaya tombol logout
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </CardContent>
    </Card>
  );
}