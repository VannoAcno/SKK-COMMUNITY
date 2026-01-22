// resources/js/pages/Album/AlbumViewerPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Camera, User, Calendar, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function AlbumViewer() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAlbumWithFotos();
  }, [albumId]);

  const fetchAlbumWithFotos = async () => {
    setLoading(true);
    try {
      const albumRes = await fetch(`/api/albums/${albumId}`);
      const albumData = await albumRes.json();
      setAlbum(albumData);

      const fotosRes = await fetch(`/api/albums/${albumId}/fotos`);
      const fotosData = await fotosRes.json();
      setFotos(fotosData);
    } catch (err) {
      console.error('Gagal mengambil album dan foto:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavbarAfter />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-[#374151]">Memuat album...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!album) {
    return (
      <>
        <NavbarAfter />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-[#374151]">Album tidak ditemukan.</div>
        </div>
        <Footer />
      </>
    );
  }

  const filteredFotos = fotos.filter(foto =>
    foto.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    foto.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              asChild
              variant="outline"
              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
            >
              <Link to="/galeri">
                ← Kembali ke Semua Album
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#374151]">{album.judul}</h1>
            <p className="text-[#6B7280]">
              {album.tanggal_pembuatan ? new Date(album.tanggal_pembuatan).toLocaleDateString('id-ID') : 'Tidak ada tanggal'} • {fotos.length} foto
            </p>
            {album.deskripsi && (
              <p className="text-[#374151] mt-2">{album.deskripsi}</p>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <Input
                placeholder="Cari foto berdasarkan judul atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15]"
              />
            </div>
          </div>

          {/* Fotos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFotos.length > 0 ? (
              filteredFotos.map((foto) => (
                <Card key={foto.id} className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={foto.gambar}
                        alt={foto.judul}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(foto.judul || 'Foto')}&background=FACC15&color=ffffff`;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#374151] truncate">{foto.judul}</h3>
                      <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                        {foto.deskripsi || 'Tidak ada deskripsi'}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-[#6B7280]">
                        <User size={12} />
                        <span>oleh {foto.user?.full_name || 'Admin'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-[#6B7280]">
                <Camera size={48} className="mx-auto mb-4 text-[#FACC15]" />
                <p>Belum ada foto dalam album ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}