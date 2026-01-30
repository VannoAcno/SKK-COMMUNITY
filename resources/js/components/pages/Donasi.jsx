// resources/js/pages/Donasi.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Heart, Image as ImageIcon, History } from 'lucide-react';
import NavbarAfter from '../shared/NavbarAfter';
import Footer from '../shared/Footer';

export default function Donasi() {
  const [user, setUser] = useState(null);
  const [kampanyes, setKampanyes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      setUser(userData);
    }

    const fetchKampanyes = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/donasi-kampanyes-aktif', {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data kampanye: ${res.status}`);
        }

        const data = await res.json();
        const aktif = data.data;
        setKampanyes(aktif);
      } catch (err) {
        console.error('Gagal mengambil kampanye donasi:', err);
        alert(`Gagal mengambil kampanye donasi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchKampanyes();
  }, []);

  const formatRupiah = (number) => {
    if (!number) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (loading) {
    return (
      <>
        <NavbarAfter user={user} />
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="text-[#374151]">Memuat kampanye...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarAfter user={user} />
      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FACC15]/10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header dengan Button Riwayat */}
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#374151]">Donasi Komunitas</h1>
              <p className="text-[#6B7280] mt-2">Dukung kegiatan dan program komunitas kami dengan berdonasi.</p>
            </div>
            {user && (
              <Link to="/riwayat-donasi">
                <Button className="bg-[#FACC15] hover:bg-[#e0b70a] text-black flex items-center gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <History size={20} />
                  Riwayat Donasi Saya
                </Button>
              </Link>
            )}
          </div>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-[#374151] font-bold text-center flex items-center justify-center gap-2">
                <Heart className="text-[#FACC15]" /> Donasi untuk Komunitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kampanyes.length > 0 ? (
                  kampanyes.map((k) => (
                    <Card key={k.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white border border-[#FEF9C3] flex flex-col">
                      {/* Bagian Gambar */}
                      <div className="relative pb-[56.25%] overflow-hidden rounded-t-md">
                        {k.gambar ? (
                          <img
                            src={k.gambar}
                            alt={k.judul}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full object-cover absolute inset-0 bg-[#FEF9C3] flex items-center justify-center">
                            <ImageIcon className="text-[#D1D5DB]" size={48} />
                          </div>
                        )}
                      </div>
                      {/* Bagian Konten */}
                      <CardContent className="p-4 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-[#374151] text-lg line-clamp-1">{k.judul}</h3>
                            <p className="text-[#6B7280] text-sm mt-1">{k.is_active ? 'Aktif' : 'Tidak Aktif'}</p>
                          </div>
                          <Target className="text-[#FACC15] flex-shrink-0 ml-2" size={20} />
                        </div>
                        <p className="text-[#6B7280] text-sm mb-2 line-clamp-2 flex-grow">{k.deskripsi || 'Tidak ada deskripsi.'}</p>
                        {/* Statistik Donasi */}
                        <div className="bg-[#FEF9C3]/50 p-2 rounded-sm border border-[#FDE68A] text-xs mb-2">
                          <p className="text-[#374151] font-medium">Terkumpul: {formatRupiah(k.total_terkumpul)}</p>
                          <p className="text-[#374151]">Donatur: {k.jumlah_donatur}</p>
                        </div>
                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#FEF9C3]">
                          <span className="text-[#374151] font-medium text-sm">{formatRupiah(k.target)}</span>
                          <Link to={`/donasi/${k.id}`} className="text-[#FACC15] hover:underline text-sm font-medium">
                            Lihat Detail
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Target className="mx-auto text-[#D1D5DB] mb-4" size={48} />
                    <p className="text-[#6B7280]">Belum ada kampanye donasi.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}