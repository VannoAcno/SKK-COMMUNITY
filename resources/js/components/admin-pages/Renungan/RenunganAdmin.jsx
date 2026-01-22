// resources/js/pages/admin/RenunganAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Plus, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function RenunganAdmin() {
  const [admin, setAdmin] = useState(null);
  const [renungans, setRenungans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
    fetchRenungans();
  }, [navigate]);

  const fetchRenungans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/renungans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setRenungans(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat daftar renungan.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus renungan ini?',
      text: 'Renungan akan dihapus permanen dari database.',
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
        const res = await fetch(`/api/admin/renungans/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal menghapus dari server');
        setRenungans(renungans.filter(k => k.id !== id));
        Swal.fire('Berhasil!', 'Renungan dihapus dari database.', 'success');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Tidak dapat menghapus renungan: ' + err.message,
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
                    <h1 className="text-2xl font-bold text-[#374151]">Kelola Renungan</h1>
                    <p className="text-[#6B7280]">Daftar renungan SKK Community.</p>
                  </div>
                  <Button
                    asChild
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    <Link to="/admin/renungans/tambah">
                      <Plus size={16} className="mr-1" />
                      Tambah Renungan
                    </Link>
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">Memuat...</div>
                ) : renungans.length === 0 ? (
                  <div className="text-center py-8 text-[#6B7280]">Belum ada renungan.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renungans.map((renungan) => (
                      <Card key={renungan.id} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <h3 className="font-bold text-[#374151]">{renungan.judul}</h3>
                          <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{renungan.isi}</p>
                          
                          <div className="flex items-center gap-2 mt-3 text-sm text-[#6B7280]">
                            <span>{new Date(renungan.tanggal).toLocaleDateString('id-ID')}</span>
                          </div>
                          
                          <div className="mt-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              renungan.kategori === 'Pagi'
                                ? 'bg-blue-100 text-blue-800'
                                : renungan.kategori === 'Malam'
                                ? 'bg-purple-100 text-purple-800'
                                : renungan.kategori === 'Mingguan'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {renungan.kategori}
                            </span>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] flex-1"
                            >
                              <Link to={`/admin/renungans/${renungan.id}/edit`}>
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(renungan.id)}
                              className="border-[#FDE68A] text-red-500 hover:bg-red-50 hover:text-red-600 flex-1"
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