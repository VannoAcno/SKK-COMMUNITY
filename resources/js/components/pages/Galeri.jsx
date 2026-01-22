// resources/js/pages/Album/GaleriPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Camera, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Galeri() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/albums');
      if (!res.ok) throw new Error('Gagal memuat data album');
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error('Gagal mengambil album:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavbarAfter />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-[#374151]">Memuat galeri album...</div>
        </div>
        <Footer />
      </>
    );
  }

  const filteredAlbums = albums.filter(album =>
    album.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#374151]">Galeri Album</h1>
            <p className="text-[#6B7280]">Album foto kegiatan SKK Community.</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <Input
                placeholder="Cari album berdasarkan judul atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15]"
              />
            </div>
          </div>

          {/* Albums Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <Card key={album.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      {album.gambar_cover ? (
                        <img
                          src={album.gambar_cover}
                          alt={album.judul}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(album.judul || 'Album')}&background=FACC15&color=ffffff`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FDE68A] flex items-center justify-center">
                          <Camera size={32} className="text-[#FACC15]" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#374151] truncate">{album.judul}</h3>
                      <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                        {album.deskripsi || 'Tidak ada deskripsi'}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {album.tanggal_pembuatan ? new Date(album.tanggal_pembuatan).toLocaleDateString('id-ID') : 'Tidak ada tanggal'}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Camera size={12} />
                            {album.fotos_count || 0} foto
                          </div>
                        </div>
                        
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                        >
                          <Link to={`/galeri/album/${album.id}`}>
                            <Eye size={14} className="mr-1" />
                            Lihat
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-[#6B7280]">
                <Camera size={48} className="mx-auto mb-4 text-[#FACC15]" />
                <p>Belum ada album yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}