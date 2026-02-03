// resources/js/pages/admin/AlbumDetail.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Camera, User, Calendar, Trash2, Plus, Eye } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function AlbumDetail() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [album, setAlbum] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      window.location.href = '/home';
      return;
    }
    setAdmin(userData);
    fetchAlbumWithFotos();
  }, [albumId]);

  const fetchAlbumWithFotos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');

      // Ambil detail album
      const albumRes = await fetch(`/api/admin/albums/${albumId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!albumRes.ok) throw new Error('Gagal mengambil data album');
      const albumData = await albumRes.json();
      setAlbum(albumData);

      // Ambil foto-foto album
      const fotosRes = await fetch(`/api/admin/albums/${albumId}/fotos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!fotosRes.ok) throw new Error('Gagal mengambil data foto');
      const fotosData = await fotosRes.json();
      setFotos(fotosData);
    } catch (err) {
      console.error('Gagal mengambil album dan foto:', err);
      // alert(`Gagal mengambil album dan foto: ${err.message}`); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal mengambil album dan foto: ${err.message}`,
        confirmButtonColor: '#FACC15',
      });
      navigate('/admin/albums'); // Kembali jika error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFoto = async (id) => {
    // const result = window.confirm('Yakin ingin menghapus foto ini?'); // ❌ GANTI INI
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus foto ini?',
      text: 'Foto akan dihapus permanen dari database dan Cloudinary.',
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
        const res = await fetch(`/api/admin/album-fotos/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal menghapus dari server');
        setFotos(fotos.filter(foto => foto.id !== id));
        // alert('Foto berhasil dihapus.'); // ❌ GANTI INI
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Foto berhasil dihapus.',
          confirmButtonColor: '#FACC15',
        });
      } catch (err) {
        console.error('Gagal menghapus foto:', err);
        // alert(`Gagal menghapus foto: ${err.message}`); // ❌ GANTI INI
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal menghapus foto: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (!admin) {
    return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">Memuat...</div>; // Ganti warna latar belakang
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#F9FAFB]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
              <div className="w-64">
                <AdminSidebar admin={admin} />
              </div>
              <div className="flex-1">
                <Card className="border-0 shadow-sm bg-white"> {/* Gaya card */}
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#374151]">Detail Album</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-[#374151]">Memuat album dan foto...</div>
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

  const filteredFotos = fotos.filter(foto =>
    foto.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    foto.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]"> {/* Ganti warna latar belakang */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64">
              <AdminSidebar admin={admin} />
            </div>

            {/* Konten Utama */}
            <div className="flex-1">
              <Card className="border-0 shadow-lg bg-white"> {/* Gaya card */}
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl text-[#374151] font-bold">Album: {album?.judul}</CardTitle>
                      <p className="text-[#6B7280]">
                        {album?.tanggal_pembuatan ? new Date(album.tanggal_pembuatan).toLocaleDateString('id-ID') : 'Tidak ada tanggal'} • {fotos.length} foto
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold shadow-md hover:shadow-lg transition-shadow" // Gaya button
                    >
                      <Link to={`/admin/albums/${albumId}/upload`}>
                        <Plus size={16} className="mr-2" />
                        Tambah Foto
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
                        placeholder="Cari foto berdasarkan judul atau deskripsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 rounded-lg" // Gaya input
                      />
                    </div>
                  </div>

                  {/* Fotos Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredFotos.length > 0 ? (
                      filteredFotos.map((foto) => (
                        <Card key={foto.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white border border-[#FEF9C3] flex flex-col"> {/* Gaya card */}
                          <CardContent className="p-0 flex-grow flex flex-col">
                            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                              <img
                                src={foto.gambar}
                                alt={foto.judul}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="absolute top-2 right-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteFoto(foto.id)}
                                  className="p-1 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full" // Gaya button hapus
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                              <h3 className="font-bold text-[#374151] truncate">{foto.judul}</h3>
                              <p className="text-sm text-[#6B7280] mt-1 line-clamp-2 flex-grow">
                                {foto.deskripsi || 'Tidak ada deskripsi'}
                              </p>

                              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#FEF9C3]">
                                <div className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <User size={12} />
                                  {foto.user?.full_name || 'Admin'}
                                </div>
                                <div className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <Calendar size={12} />
                                  {new Date(foto.created_at).toLocaleDateString('id-ID')}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Camera size={48} className="mx-auto mb-4 text-[#FACC15]" />
                        <p>Belum ada foto dalam album ini.</p>
                        <Button
                          asChild
                          variant="outline"
                          className="mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]" // Gaya button
                        >
                          <Link to={`/admin/albums/${albumId}/upload`}>
                            Tambah Foto Pertama
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      asChild
                      className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]" // Gaya button
                    >
                      <Link to="/admin/galeris">
                        ← Kembali ke Daftar Album
                      </Link>
                    </Button>
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