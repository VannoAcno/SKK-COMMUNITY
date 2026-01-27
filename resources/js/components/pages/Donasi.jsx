// resources/js/pages/Donasi.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Heart, Image as ImageIcon } from 'lucide-react';
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
        // Filter hanya kampanye yang aktif (sudah difilter di backend, tapi tetap aman untuk filter lagi jika perlu)
        const aktif = data.data; // Karena controller sudah memfilter is_active
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
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-[#374151] font-bold text-center flex items-center justify-center gap-2">
                <Heart className="text-[#FACC15]" /> Donasi untuk Komunitas
              </CardTitle>
              <p className="text-center text-[#6B7280]">
                Dukung kegiatan dan program komunitas kami dengan berdonasi.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kampanyes.length > 0 ? (
                  kampanyes.map((k) => (
                    <Card key={k.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white border border-[#FEF9C3] flex flex-col">
                      {/* Bagian Gambar */}
                      <div className="relative pb-[56.25%] overflow-hidden rounded-t-md"> {/* Aspect ratio 16:9 */}
                        {k.gambar ? (
                          <img
                            src={k.gambar}
                            alt={k.judul}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                              e.target.style.display = 'none'; // Sembunyikan jika error
                              e.target.nextSibling.style.display = 'flex'; // Tampilkan ikon fallback
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
                    <Button
                      className="mt-4 bg-[#FACC15] hover:bg-[#e0b70a] text-black"
                      asChild
                    >
                      <Link to="/donasi">
                        <Plus className="mr-2 h-4 w-4" />
                        Muat Ulang
                      </Link>
                    </Button>
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