// src/components/shared/NavbarLanding.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NavbarBefore() {
  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo — klik kembali ke home */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-[#FACC15] tracking-wide hover:opacity-90 transition-opacity">
          SKK Community
        </Link>

        {/* Tombol Login */}
        <Link to="/login">
          <Button
            className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold px-10 py-2 rounded-full transition-all"
          >
            Login
          </Button>
        </Link>
      </div>
    </nav>
  );
}