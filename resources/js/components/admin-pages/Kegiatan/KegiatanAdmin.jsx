import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Plus, Edit, Trash2, CheckCircle, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
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
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat daftar kegiatan.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus kegiatan ini?',
      text: 'Kegiatan akan dihapus permanen dari database.',
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
        Swal.fire('Berhasil!', 'Kegiatan dihapus dari database.', 'success');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Tidak dapat menghapus kegiatan: ' + err.message,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  // ✅ Tambahkan fungsi handleSelesaikan
  const handleSelesaikan = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menyelesaikan kegiatan ini?',
      text: 'Kegiatan akan diubah menjadi laporan dan tidak akan muncul di daftar agenda.',
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
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal menyelesaikan kegiatan');
        const updatedKegiatan = await res.json();
        setKegiatans(kegiatans.map(k => k.id === id ? updatedKegiatan : k));
        Swal.fire('Berhasil!', 'Kegiatan telah diselesaikan.', 'success');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Tidak dapat menyelesaikan kegiatan: ' + err.message,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (!admin) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64">
            <AdminSidebar admin={admin} />
          </div>
          <div className="flex-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-[#374151]">Kelola Kegiatan</h1>
                    <p className="text-[#6B7280]">Daftar kegiatan SKK Community.</p>
                  </div>
                  <Button
                    asChild
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    <Link to="/admin/kegiatans/tambah">
                      <Plus size={16} className="mr-1" />
                      Tambah Kegiatan
                    </Link>
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">Memuat...</div>
                ) : kegiatans.length === 0 ? (
                  <div className="text-center py-8 text-[#6B7280]">Belum ada kegiatan.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kegiatans.map((kegiatan) => (
                      <Card key={kegiatan.id} className="border-0 shadow-sm rounded-lg overflow-hidden">
                        <CardContent className="p-4">
                          {/* Gambar */}
                          {kegiatan.gambar ? (
                            <img
                              src={`${kegiatan.gambar}?v=${Date.now()}`}
                              alt={kegiatan.judul}
                              className="w-full h-40 object-cover rounded-md mb-3"
                              onError={(e) => {
                                e.target.src = `https://placehold.co/400x200/FACC15/white?text=      ${encodeURIComponent(kegiatan.judul.substring(0, 15))}`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-40 bg-[#FACC15]/20 rounded-md flex items-center justify-center">
                              <span className="text-xs text-white">Tanpa Gambar</span>
                            </div>
                          )}

                          {/* Judul */}
                          <h3 className="font-bold text-[#374151] line-clamp-2">{kegiatan.judul}</h3>

                          {/* Lokasi */}
                          <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">{kegiatan.lokasi || '—'}</p>

                          {/* Tanggal */}
                          <p className="text-xs text-[#6B7280] mt-1">
                            {new Date(kegiatan.tanggal_mulai).toLocaleDateString('id-ID')}
                            {kegiatan.tanggal_selesai && (
                              <> → {new Date(kegiatan.tanggal_selesai).toLocaleDateString('id-ID')}</>
                            )}
                          </p>

                          {/* Tombol Aksi */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {/* Edit */}
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] text-xs px-3 py-1"
                            >
                              <Link to={`/admin/kegiatans/${kegiatan.id}/edit`}>
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Link>
                            </Button>

                            {/* Selesaikan (hanya untuk agenda) */}
                            {kegiatan.tipe === 'agenda' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSelesaikan(kegiatan.id)}
                                className="border-[#FDE68A] text-blue-600 hover:bg-blue-50 text-xs px-3 py-1"
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Selesaikan
                              </Button>
                            )}

                            {/* Lihat Peserta */}
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="border-[#FDE68A] text-purple-600 hover:bg-purple-50 text-xs px-3 py-1"
                            >
                              <Link to={`/admin/kegiatans/${kegiatan.id}/peserta`}>
                                <Users size={14} className="mr-1" />
                                Lihat Peserta
                              </Link>
                            </Button>

                            {/* Hapus */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(kegiatan.id)}
                              className="border-[#FDE68A] text-red-500 hover:bg-red-50 text-xs px-3 py-1"
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
  );
}