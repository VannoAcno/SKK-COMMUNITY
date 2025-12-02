// src/components/shared/NavbarAfter.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layout, LogOut, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavbarAfter() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center">
            <Layout size={16} className="text-black" />
          </div>
          <h1 className="text-lg font-bold text-[#374151]">SKK Community</h1>
        </div>

        {/* 👇 Bagian kanan: Kritik & Saran + Keluar */}
        <div className="flex items-center gap-3">
          {/* Kritik & Saran */}
          <Button
            variant="ghost"
            asChild
            className="text-[#374151] hover:bg-[#FEF9C3] flex items-center gap-1"
          >
            <Link to="/kritik-saran">
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Kritik & Saran</span>
            </Link>
          </Button>

          {/* Keluar */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-[#374151] hover:bg-[#FEF9C3] flex items-center gap-1"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}