// resources/js/components/admin-pages/Album/AdminAlbumsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Camera, Calendar, Plus, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function AlbumAdmin() {
  const [admin, setAdmin] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      window.location.href = '/home';
      return;
    }
    setAdmin(userData);
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/albums', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal memuat data album');
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error('Gagal mengambil album:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat daftar album.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus album ini?',
      text: 'Album beserta semua fotonya akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/admin/albums/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal menghapus dari server');
        setAlbums(albums.filter(album => album.id !== id));
        Swal.fire('Berhasil!', 'Album berhasil dihapus.', 'success');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Tidak dapat menghapus album: ' + err.message,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (!admin) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat...</div>;
  }

  const filteredAlbums = albums.filter(album =>
    album.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64">
            <AdminSidebar admin={admin} />
          </div>

          {/* Konten Utama */}
          <div className="flex-1">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-[#374151]">Manajemen Album</CardTitle>
                    <p className="text-[#6B7280]">Kelola album dan foto-foto SKK.</p>
                  </div>
                  <Button
                    asChild
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    <Link to="/admin/albums/tambah">
                      <Plus size={16} className="mr-1" />
                      Tambah Album
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                          <div className="aspect-video overflow-hidden rounded-t-lg relative">
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
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDelete(album.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 h-6 w-6"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
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
                                <Link to={`/admin/albums/${album.id}`}>
                                  <Eye size={14} className="mr-1" />
                                  Detail
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
                      <p>Belum ada album yang dibuat.</p>
                      <Button
                        asChild
                        variant="outline"
                        className="mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                      >
                        <Link to="/admin/albums/tambah">
                          Buat Album Pertama
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}