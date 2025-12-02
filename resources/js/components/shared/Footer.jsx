// src/components/shared/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  MessageSquare,
  Youtube,
  Facebook,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-8">
      {/* Gradient Top Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#FACC15] to-transparent mb-8"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Kolom 1: Logo & Tagline */}
          <div>
            <div className="text-2xl font-bold text-[#FACC15] mb-2 flex items-center gap-2">
              <Heart size={24} strokeWidth={2} />
              SKK Community
            </div>
            <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
              Wadah persekutuan siswa Kristen lintas sekolah di Surabaya — bersatu dalam kasih Kristus.
            </p>
          </div>

          {/* Kolom 2: Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FACC15]">Hubungi Kami</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 hover:text-[#FACC15] transition-colors cursor-pointer group">
                <Mail size={20} className="group-hover:scale-110 transition-transform" />
                <Link to="mailto:info@skkcommunity.sch.id" className="hover:underline">
                  info@skkcommunity.sch.id
                </Link>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-[#FACC15] transition-colors cursor-pointer group">
                <Phone size={20} className="group-hover:scale-110 transition-transform" />
                <Link to="tel:+6281234567890" className="hover:underline">
                  +62 812-3456-7890
                </Link>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-[#FACC15] transition-colors cursor-pointer group">
                <MapPin size={20} className="group-hover:scale-110 transition-transform" />
                Surabaya, Jawa Timur
              </div>
            </div>
          </div>

          {/* Kolom 3: Media Sosial */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FACC15]">Ikuti Kami</h3>
            <div className="flex space-x-4">
              {[
                { name: 'Instagram', icon: Instagram, href: '#' },
                { name: 'WhatsApp', icon: MessageSquare, href: '#' },
                { name: 'YouTube', icon: Youtube, href: '#' },
                { name: 'Facebook', icon: Facebook, href: '#' },
              ].map((social, i) => (
                <Link
                  key={i}
                  to={social.href}
                  className="text-gray-300 hover:text-[#FACC15] transition-all duration-200 transform hover:scale-125 hover:rotate-6"
                >
                  <social.icon size={24} strokeWidth={1.5} />
                </Link>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Dapatkan update kegiatan & renungan harian!
            </p>
          </div>
        </div>

        {/* Garis pemisah */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Hak cipta — dengan efek subtle */}
        <div className="text-center text-gray-500 text-sm tracking-wide">
          © {new Date().getFullYear()} SKK Community. All rights reserved.
        </div>
      </div>

      {/* Gradient Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#FDE68A] to-transparent mt-8"></div>
    </footer>
  );
}