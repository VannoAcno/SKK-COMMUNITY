import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Renungan() {
  const [renungans, setRenungans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenungans = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/renungans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRenungans(await res.json());
      } catch (err) {
        console.error('Gagal mengambil renungan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRenungans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#374151]">Memuat renungan...</div>
      </div>
    );
  }

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#374151] mb-6">Renungan Harian</h1>
          <p className="text-[#6B7280] mb-8">
            Temukan inspirasi dan hikmah dari renungan-renungan yang kami sajikan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renungans.map((renungan) => (
              <Card key={renungan.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  {renungan.gambar && (
                    <img
                      src={renungan.gambar}
                      alt={renungan.judul}
                      className="w-full h-40 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x200/FACC15/white?text=${encodeURIComponent(renungan.judul.substring(0, 15))}`;
                      }}
                    />
                  )}
                  <h3 className="font-bold text-[#374151]">{renungan.judul}</h3>
                  <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{renungan.isi}</p>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-[#6B7280]">
                    <Calendar size={14} />
                    <span>{new Date(renungan.tanggal).toLocaleDateString('id-ID')}</span>
                  </div>
                  
                  <div className="mt-3">
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {renungan.kategori}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                  >
                    <Link to={`/renungans/${renungan.id}`}>Baca Selengkapnya</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {renungans.length === 0 && (
            <div className="text-center py-12 text-[#6B7280]">
              <BookOpen size={48} className="mx-auto mb-4 text-[#FACC15]" />
              <p>Belum ada renungan terbaru.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}