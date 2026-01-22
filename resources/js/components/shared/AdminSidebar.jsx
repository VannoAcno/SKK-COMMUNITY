// resources/js/components/shared/AdminSidebar.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Calendar, Heart, MessageCircle, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
  { name: 'Kegiatan', icon: Calendar, path: '/admin/kegiatans' },
  { name: 'Donasi', icon: Heart, path: '/admin/donasis' },
  { name: 'Galeri', icon: Heart, path: '/admin/galeris' },
  { name: 'Forum', icon: MessageCircle, path: '/admin/forums' },
  { name: 'Renungan', icon: Heart, path: '/admin/renungans' },
];

export default function AdminSidebar({ admin }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin logout?',
      text: 'Anda akan keluar dari akun admin.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardContent className="p-4 space-y-2">
        {/* Profil Admin → Link ke Edit Profile */}
        {admin && (
          <Link to="/admin/profile/edit" className="block"> {/* ✅ Perbaiki: /admin/profile/edit */}
            <div className="flex items-center gap-3 p-2 bg-[#FEF9C3]/50 rounded-md mb-4 hover:bg-[#FEF9C3] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center overflow-hidden">
                {admin.avatar ? (
                  <img
                    src={admin.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.full_name || 'A')}&background=FACC15&color=ffffff&size=32`;
                    }}
                  />
                ) : (
                  <User size={14} className="text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#374151]">{admin.full_name}</p>
                <p className="text-xs text-[#6B7280] truncate">{admin.email}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Menu Navigasi */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-[#FACC15] text-black font-medium'
                  : 'text-[#374151] hover:bg-[#FEF9C3]'
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Tombol Logout */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] mt-8 flex items-center gap-3"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </CardContent>
    </Card>
  );
}