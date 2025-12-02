// resources/js/pages/galeri/GaleriPage.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Galeri() {
  const galleries = [
    {
      id: 1,
      title: 'Retret Pemuda 2025',
      date: '15–17 Februari 2025',
      imageCount: 42,
    },
    {
      id: 2,
      title: 'Bakti Sosial SKK',
      date: '22 Maret 2025',
      imageCount: 28,
    },
    {
      id: 3,
      title: 'Kebaktian Bersama',
      date: '5 April 2025',
      imageCount: 35,
    },
  ];

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#374151] mb-6">Galeri Kegiatan</h1>
          <p className="text-[#6B7280] mb-8">
            Dokumentasi kegiatan rohani dan pelayanan SKK Community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Link key={gallery.id} to={`/galeri/${gallery.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow border-0 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-[#FDE68A] to-[#FACC15] flex items-center justify-center">
                    <ImageIcon size={48} className="text-white" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-[#374151] mb-1">{gallery.title}</h3>
                    <div className="flex justify-between items-center text-sm text-[#6B7280]">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {gallery.date}
                      </div>
                      <span>{gallery.imageCount} foto</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}