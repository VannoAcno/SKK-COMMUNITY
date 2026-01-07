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
import Swal from 'sweetalert2';

// ✅ Warna SKK
const SKK_PRIMARY = '#FACC15';
const SKK_PRIMARY_DARK = '#EAB308';
const SKK_TEXT = '#374151';
const SKK_BG = '#fff';
const SKK_BORDER = '#FDE68A';

// ✅ Konfigurasi SweetAlert2 khusus SKK
const showSKKConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '<span class="font-semibold">Keluar</span>',
    cancelButtonText: '<span class="font-semibold">Batalkan</span>',
    reverseButtons: true,
    background: SKK_BG,
    color: SKK_TEXT,
    iconColor: SKK_PRIMARY,
    confirmButtonColor: SKK_PRIMARY,
    cancelButtonColor: '#d1d5db',
    customClass: {
      popup: 'rounded-xl border border-[#FDE68A] shadow-lg p-4',
      title: 'text-xl font-bold text-[#374151]',
      content: 'text-sm text-[#6B7280]',
      actions: 'pt-4',
      confirmButton: 'bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-6 py-2',
      cancelButton: 'bg-gray-100 hover:bg-gray-200 text-[#374151] font-semibold rounded-md px-6 py-2',
    },
    buttonsStyling: false,
    showCloseButton: true,
    closeButtonHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9CA3AF" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>',
  });
};

const showSKKSuccess = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
    background: SKK_BG,
    color: SKK_TEXT,
    iconColor: SKK_PRIMARY,
    customClass: {
      popup: 'rounded-xl border border-[#FDE68A] shadow-lg p-4',
      title: 'text-lg font-bold text-[#374151]',
      content: 'text-sm text-[#6B7280]',
    },
  });
};

const showSKKError = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    background: SKK_BG,
    color: SKK_TEXT,
    iconColor: '#ef4444',
    confirmButtonColor: SKK_PRIMARY,
    customClass: {
      popup: 'rounded-xl border border-[#FDE68A] shadow-lg p-4',
      title: 'text-lg font-bold text-[#374151]',
      content: 'text-sm text-[#6B7280]',
      confirmButton: 'bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-6 py-2',
    },
  });
};

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=SKK&background=FACC15&color=ffffff&size=32';

export default function NavbarAfter() {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const avatar = (userData.avatar || DEFAULT_AVATAR).trim();
  const fullName = userData.full_name || 'Anggota';

  const handleLogout = async () => {
    const result = await showSKKConfirm('Yakin ingin keluar?', 'Anda akan logout dari akun ini.');

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');

        if (token) {
          await fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        await showSKKSuccess('Logout Berhasil!', 'Anda telah keluar dari akun Anda.');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        await showSKKError('Logout Gagal!', 'Silakan coba lagi.');
      }
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/home">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center">
              <Layout size={16} className="text-black" />
            </div>
            <h1 className="text-lg font-bold text-[#374151]">SKK Community</h1>
          </div>
        </Link>

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