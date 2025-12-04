// src/components/shared/NavbarAfter.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layout, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=SKK&background=FACC15&color=white&size=32';

export default function NavbarAfter() {
  const navigate = useNavigate();
  
  // Ambil data user dari localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const avatar = userData.avatar || DEFAULT_AVATAR;
  const fullName = userData.full_name || 'Anggota';

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center">
            <Layout size={16} className="text-black" />
          </div>
          <h1 className="text-lg font-bold text-[#374151]">SKK Community</h1>
        </div>

        {/* ✅ Area Profil: Foto + Nama + Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1 hover:bg-transparent"
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#FACC15] overflow-hidden">
                <img
                  src={avatar}
                  alt="Profil"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <span className="text-[#374151] font-medium hidden md:block">{fullName}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="p-2">
              <div className="flex items-center gap-3 p-2">
                <div className="w-12 h-10 rounded-full overflow-hidden">
                  <img
                    src={avatar}
                    alt="Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">{fullName}</p>
                  <p className="text-xs text-[#6B7280]">{userData.email}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 p-1">
              <Link
                to="/profile"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-[#FEF9C3] rounded-md"
              >
                <UserIcon size={16} />
                Profil Saya
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-[#FEF9C3] rounded-md mt-1"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}