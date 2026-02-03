// resources/js/pages/admin/AlbumAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Search, Camera, Calendar, Plus, Eye, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
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
        text: `Gagal memuat daftar album: ${err.message}`,
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
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Album berhasil dihapus.',
          confirmButtonColor: '#FACC15',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal menghapus album: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (!admin) {
    return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">Memuat...</div>;
  }

  const filteredAlbums = albums.filter(album =>
    album.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64">
              <AdminSidebar admin={admin} />
            </div>

            {/* Konten Utama */}
            <div className="flex-1">
              <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
                <CardHeader className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#374151]">Manajemen Album</CardTitle>
                      <p className="text-[#6B7280] mt-1">
                        Kelola album dan foto-foto SKK Community.
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <Link to="/admin/albums/tambah">
                        <Plus size={16} className="mr-2" />
                        Tambah Album
                      </Link>
                    </Button>
                  </div>
                </CardHeader>

                {/* Search Bar */}
                <CardContent className="px-6 pb-6">
                  <div className="mb-6">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                      <Input
                        placeholder="Cari album berdasarkan judul atau deskripsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 rounded-lg h-10"
                      />
                    </div>
                  </div>

                  {/* Albums Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAlbums.length > 0 ? (
                      filteredAlbums.map((album) => (
                        <Card
                          key={album.id}
                          className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white rounded-xl overflow-hidden flex flex-col"
                        >
                          {/* Cover Image */}
                          <div className="relative aspect-[4/3] overflow-hidden">
                            {album.gambar_cover ? (
                              <img
                                src={album.gambar_cover}
                                alt={album.judul}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-[#FEF9C3] flex items-center justify-center">
                                <Camera size={48} className="text-[#9CA3AF]" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] p-1.5 h-8 w-8"
                              >
                                <Link to={`/admin/albums/${album.id}`}>
                                  <Eye size={14} />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(album.id)}
                                className="border-red-300 text-red-500 hover:bg-red-50 p-1.5 h-8 w-8"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <CardContent className="p-4 flex-grow flex flex-col">
                            <h3 className="font-bold text-[#374151] text-lg line-clamp-1">{album.judul}</h3>
                            <p className="text-[#6B7280] text-sm mt-2 line-clamp-2">
                              {album.deskripsi || 'Tidak ada deskripsi.'}
                            </p>

                            <div className="mt-4 pt-4 border-t border-[#F3F4F6] flex flex-col gap-2">
                              <div className="flex items-center text-xs text-[#6B7280]">
                                <Calendar size={12} className="mr-2" />
                                {album.tanggal_pembuatan
                                  ? new Date(album.tanggal_pembuatan).toLocaleDateString('id-ID')
                                  : 'Tidak ada tanggal'}
                              </div>
                              <div className="flex items-center text-xs text-[#6B7280]">
                                <Camera size={12} className="mr-2" />
                                {album.fotos_count || 0} foto
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Camera size={48} className="mx-auto mb-4 text-[#FACC15]" />
                        <p className="text-[#6B7280] text-lg">Belum ada album yang dibuat.</p>
                        <Button
                          asChild
                          variant="outline"
                          className="mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] px-6 py-2"
                        >
                          <Link to="/admin/albums/tambah">Buat Album Pertama</Link>
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
      <Footer />
    </>
  );
}