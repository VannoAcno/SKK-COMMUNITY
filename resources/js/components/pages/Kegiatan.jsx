// resources/js/pages/KegiatanPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Kegiatan() {
  const [kegiatans, setKegiatans] = useState([]); // ✅ Ganti nama state
  const [loading, setLoading] = useState(true);

  // ✅ Cek apakah user sudah login
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    window.location.href = '/';
    return null;
  }

  useEffect(() => {
    const fetchKegiatans = async () => { // ✅ Ganti nama fungsi
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/kegiatans', { // ✅ Ganti ke /api/kegiatans (jamak)
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Gagal mengambil data kegiatan');
        setKegiatans(await res.json()); // ✅ Ganti nama state
      } catch (err) {
        console.error('Gagal ambil kegiatan:', err);
        alert('Gagal mengambil daftar kegiatan.');
      } finally {
        setLoading(false);
      }
    };
    fetchKegiatans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#374151]">Memuat kegiatan...</div>
      </div>
    );
  }

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#374151]">Kegiatan SKK Community</h1>
            <p className="text-[#6B7280]">Daftar agenda kegiatan terbaru.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kegiatans.map((kegiatan) => ( // ✅ Ganti ke `kegiatan`
              <Card key={kegiatan.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  {kegiatan.gambar && (
                    <img
                      src={kegiatan.gambar}
                      alt={kegiatan.judul}
                      className="w-full h-40 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x200/FACC15/white?text=${encodeURIComponent(kegiatan.judul.substring(0, 15))}`;
                      }}
                    />
                  )}
                  <h3 className="font-bold text-[#374151]">{kegiatan.judul}</h3>
                  <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{kegiatan.deskripsi}</p>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-[#6B7280]">
                    <Calendar size={14} />
                    <span>
                      {new Date(kegiatan.tanggal_mulai).toLocaleDateString('id-ID')}
                      {kegiatan.tanggal_selesai && ` → ${new Date(kegiatan.tanggal_selesai).toLocaleDateString('id-ID')}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 text-sm text-[#6B7280]">
                    <MapPin size={14} />
                    <span>{kegiatan.lokasi}</span>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      kegiatan.tipe === 'agenda'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {kegiatan.tipe === 'agenda' ? 'Agenda' : 'Laporan'}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                  >
                    <Link to={`/kegiatan/${kegiatan.id}`}>Lihat Detail</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {kegiatans.length === 0 && ( // ✅ Ganti ke `kegiatans`
            <div className="text-center py-12 text-[#6B7280]">
              <Calendar size={48} className="mx-auto mb-4 text-[#FACC15]" />
              <p>Belum ada kegiatan terbaru.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}