import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Users, CreditCard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import TambahKampanyeForm from './TambahKampanye';
import EditKampanyeForm from './EditKampanye';
import Swal from 'sweetalert2';

export default function DonasiAdmin() {
  const [admin, setAdmin] = useState(null);
  const [kampanyes, setKampanyes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingKampanye, setEditingKampanye] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
    fetchKampanyes();
  }, [navigate]);

  const fetchKampanyes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/donasi-kampanye', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setKampanyes(data.data || data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memuat kampanye donasi.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTambahSuccess = () => {
    setShowTambah(false);
    setFormErrors({});
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Kampanye donasi berhasil ditambahkan.',
      confirmButtonColor: '#FACC15',
      timer: 1500,
      showConfirmButton: false,
    });

    setRefreshing(true);
    setTimeout(() => {
      fetchKampanyes();
    }, 1000);
  };

  const handleEditSubmit = async (formData) => {
    const token = localStorage.getItem('auth_token');
    const fd = new FormData();
    fd.append('_method', 'PUT');
    fd.append('judul', formData.judul);
    if (formData.deskripsi) fd.append('deskripsi', formData.deskripsi);
    if (formData.target) fd.append('target', formData.target);
    fd.append('is_active', formData.is_active ? '1' : '0');
    if (formData.gambar) fd.append('gambar', formData.gambar);

    try {
      const res = await fetch(`/api/admin/donasi-kampanye/${editingKampanye.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });

      const result = await res.json();
      if (!res.ok) {
        if (result.errors) setFormErrors(result.errors);
        throw new Error(result.message || 'Gagal memperbarui.');
      }

      setShowEdit(false);
      setEditingKampanye(null);
      setFormErrors({});
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: result.message,
        confirmButtonColor: '#FACC15',
      });
      
      setRefreshing(true);
      setTimeout(() => {
        fetchKampanyes();
      }, 500);

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Error: ${err.message}`,
        confirmButtonColor: '#FACC15',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus kampanye ini?',
      text: "Semua transaksi terkait juga akan dihapus.",
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
        const res = await fetch(`/api/admin/donasi-kampanye/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal menghapus');
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kampanye berhasil dihapus.',
          confirmButtonColor: '#FACC15',
          timer: 1500,
          showConfirmButton: false,
        });
        
        setRefreshing(true);
        setTimeout(() => {
          fetchKampanyes();
        }, 500);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal menghapus kampanye: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (!admin) return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">Memuat...</div>;

  const filtered = kampanyes.filter(k =>
    k.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.deskripsi && k.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatRupiah = (num) => num ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num) : '-';

  const getProgressPercentage = (total, target) => {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.round((total / target) * 100));
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
                      <CardTitle className="text-2xl font-bold text-[#374151]">
                        Manajemen Kampanye Donasi
                      </CardTitle>
                      <p className="text-[#6B7280]">Kelola kampanye donasi komunitas</p>
                    </div>
                    <Dialog open={showTambah} onOpenChange={setShowTambah}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setFormErrors({})}
                          className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold shadow-md hover:shadow-lg transition-shadow"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Tambah Kampanye
                        </Button>
                      </DialogTrigger>
                      <TambahKampanyeForm
                        open={showTambah}
                        onOpenChange={setShowTambah}
                        onSubmit={handleTambahSuccess}
                        errors={formErrors}
                      />
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] h-4 w-4" />
                      <Input
                        placeholder="Cari berdasarkan judul atau deskripsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 rounded-lg"
                      />
                    </div>
                  </div>

                  {refreshing && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-blue-700">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-sm font-medium">Memperbarui data...</span>
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center py-8 text-[#6B7280]">Memuat data...</div>
                  ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((k) => {
                        const progress = getProgressPercentage(k.total_donasi || 0, k.target || 0);
                        return (
                          <Card
                            key={k.id}
                            className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white border border-[#FEF9C3] flex flex-col"
                          >
                            <div className="relative pb-[56.25%] overflow-hidden rounded-t-lg">
                              {k.gambar ? (
                                <img
                                  src={k.gambar}
                                  alt={k.judul}
                                  className="w-full h-full object-cover absolute inset-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full object-cover absolute inset-0 bg-[#FEF9C3] flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-[#9CA3AF]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h6V4m0 0H8v4m0 0l2-2m2 2l-2 2"
                                    />
                                  </svg>
                                </div>
                              )}
                              <Badge
                                variant={k.is_active ? 'default' : 'secondary'}
                                className="absolute top-2 right-2 text-xs px-2 py-1 bg-[#FACC15] text-black border border-[#FDE68A]"
                              >
                                {k.is_active ? 'Aktif' : 'Non-Aktif'}
                              </Badge>
                            </div>
                            <CardContent className="p-4 flex-grow flex flex-col">
                              <h3 className="font-semibold text-[#374151] text-lg line-clamp-2">
                                {k.judul}
                              </h3>
                              <p className="text-[#6B7280] text-sm mt-1 line-clamp-2 flex-grow">
                                {k.deskripsi || '-'}
                              </p>

                              {k.target && (
                                <div className="space-y-1 mt-3">
                                  <div className="flex justify-between text-xs text-[#6B7280]">
                                    <span>
                                      {formatRupiah(k.total_donasi || 0)} dari{' '}
                                      {formatRupiah(k.target)}
                                    </span>
                                    <span>{progress}%</span>
                                  </div>
                                  <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        progress >= 100
                                          ? 'bg-green-500'
                                          : progress >= 50
                                          ? 'bg-yellow-500'
                                          : 'bg-[#FACC15]'
                                      }`}
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/admin/donasi/kampanye/${k.id}`)}
                                  className="border-[#FDE68A] text-[#374151] text-xs hover:bg-[#FEF9C3] flex items-center gap-1 px-2 py-1"
                                >
                                  <Users className="w-3 h-3" /> Detail
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    navigate(`/admin/donasi/kampanye/${k.id}/transaksi`)
                                  }
                                  className="border-[#FDE68A] text-[#374151] text-xs hover:bg-[#FEF9C3] flex items-center gap-1 px-2 py-1"
                                >
                                  <CreditCard className="w-3 h-3" /> Transaksi
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingKampanye(k);
                                    setFormErrors({});
                                    setShowEdit(true);
                                  }}
                                  className="border-[#FDE68A] text-[#374151] text-xs hover:bg-[#FEF9C3] flex items-center gap-1 px-2 py-1"
                                >
                                  <Edit className="w-3 h-3" /> Edit
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(k.id)}
                                  className="border-red-300 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1 px-2 py-1"
                                >
                                  <Trash2 className="w-3 h-3" /> Hapus
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6B7280]">
                      {searchTerm ? 'Tidak ada hasil.' : 'Belum ada kampanye donasi.'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {editingKampanye && (
        <EditKampanyeForm
          open={showEdit}
          onOpenChange={(open) => {
            setShowEdit(open);
            if (!open) {
              setEditingKampanye(null);
              setFormErrors({});
            }
          }}
          onSubmit={handleEditSubmit}
          kampanye={editingKampanye}
          errors={formErrors}
        />
      )}
    </>
  );
}