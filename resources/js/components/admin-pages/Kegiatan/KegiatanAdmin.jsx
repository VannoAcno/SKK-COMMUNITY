// resources/js/pages/admin/KegiatanAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Plus, Edit, Trash2, CheckCircle, Users, Target } from 'lucide-react';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2';

export default function KegiatanAdmin() {
  const [admin, setAdmin] = useState(null);
  const [kegiatans, setKegiatans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
    fetchKegiatans();
  }, [navigate]);

  const fetchKegiatans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/kegiatans', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setKegiatans(data);
    } catch (err) {
      console.error('Gagal mengambil kegiatan:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal mengambil daftar kegiatan: ${err.message}`,
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus kegiatan ini?',
      text: "Kegiatan akan dihapus permanen dari database.",
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
        const res = await fetch(`/api/admin/kegiatans/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal menghapus dari server');
        setKegiatans(kegiatans.filter(k => k.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kegiatan dihapus dari database.',
          confirmButtonColor: '#FACC15',
        });
      } catch (err) {
        console.error('Gagal menghapus kegiatan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal menghapus kegiatan: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  const handleSelesaikan = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menyelesaikan kegiatan ini?',
      text: "Kegiatan akan diubah menjadi tidak aktif dan tidak akan muncul di daftar agenda publik.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Selesaikan!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/admin/kegiatans/${id}/selesaikan`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Gagal menyelesaikan kegiatan.');
        }

        // ✅ PERBAIKAN: LANGSUNG UPDATE STATE TANPA MENGANDALKAN RESPONSE
        setKegiatans(prevKegiatans => 
          prevKegiatans.map(k => 
            k.id === id ? { ...k, is_active: false } : k
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kegiatan berhasil diselesaikan.',
          confirmButtonColor: '#FACC15',
        });
      } catch (err) {
        console.error('Gagal menyelesaikan kegiatan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal menyelesaikan kegiatan: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (!admin) {
    return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">Memuat...</div>;
  }

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID');
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="w-64">
              <AdminSidebar admin={admin} />
            </div>
            <div className="flex-1">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#374151]">Kelola Kegiatan</CardTitle>
                      <p className="text-[#6B7280]">Daftar kegiatan SKK Community.</p>
                    </div>
                    <Button
                      asChild
                      className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Link to="/admin/kegiatans/tambah">
                        <Plus size={16} className="mr-2" />
                        Tambah Kegiatan
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-[#6B7280]">Memuat kegiatan...</div>
                  ) : kegiatans.length === 0 ? (
                    <div className="text-center py-8 text-[#6B7280]">
                      <Target size={48} className="mx-auto mb-4 text-[#FACC15]" />
                      <p>Belum ada kegiatan.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {kegiatans.map((kegiatan) => (
                        <Card key={kegiatan.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white border border-[#FEF9C3] flex flex-col">
                          <CardContent className="p-4 flex-grow flex flex-col">
                            {kegiatan.gambar ? (
                              <img
                                src={kegiatan.gambar}
                                alt={kegiatan.judul}
                                className="w-full h-40 object-cover rounded-md mb-3"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <div className="w-full h-40 bg-[#FEF9C3] rounded-md flex items-center justify-center">
                                <span className="text-xs text-[#6B7280]">Tanpa Gambar</span>
                              </div>
                            )}
                            <h3 className="font-bold text-[#374151] line-clamp-2">{kegiatan.judul}</h3>
                            <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">{kegiatan.lokasi || '—'}</p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              {formatTanggal(kegiatan.tanggal_mulai)} → {formatTanggal(kegiatan.tanggal_selesai)}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs">
                              <Badge variant="default" className="capitalize">
                                Agenda
                              </Badge>
                              <Badge variant={kegiatan.is_active ? 'default' : 'secondary'}>
                                {kegiatan.is_active ? 'Aktif' : 'Tidak Aktif'}
                              </Badge>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] text-xs px-2 py-1"
                              >
                                <Link to={`/admin/kegiatans/${kegiatan.id}/edit`}>
                                  <Edit size={14} className="mr-1" />
                                  Edit
                                </Link>
                              </Button>

                              {kegiatan.tipe === 'agenda' && kegiatan.is_active && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSelesaikan(kegiatan.id)}
                                  className="border-[#FDE68A] text-blue-600 hover:bg-blue-50 text-xs px-2 py-1"
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Selesaikan
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="border-[#FDE68A] text-purple-600 hover:bg-purple-50 text-xs px-2 py-1"
                              >
                                <Link to={`/admin/kegiatans/${kegiatan.id}/peserta`}>
                                  <Users size={14} className="mr-1" />
                                  Peserta
                                </Link>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(kegiatan.id)}
                                className="border-[#FDE68A] text-red-500 hover:bg-red-50 text-xs px-2 py-1"
                              >
                                <Trash2 size={14} className="mr-1" />
                                Hapus
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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