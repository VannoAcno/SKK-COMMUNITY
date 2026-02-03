// resources/js/pages/admin/TransaksiDetail.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle, XCircle, Clock, Image as ImageIcon, Eye } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function TransaksiDetail() {
  const { id } = useParams(); // ID donasi dari URL
  const [admin, setAdmin] = useState(null);
  const [donasi, setDonasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek otorisasi admin
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);

    const fetchDonasiDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login ulang.');
        }

        const res = await fetch(`/api/admin/donasi/${id}`, { // Endpoint untuk detail donasi admin
          headers: {
            'Authorization': `Bearer ${token}`, // Pastikan ini benar
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          const text = await res.text(); // Baca teks untuk diagnosa
          throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}...`);
        }

        const data = await res.json(); // Ini akan gagal jika res bukan JSON
        setDonasi(data.data);

      } catch (err) {
        console.error('Error fetching donasi detail:', err);
        // alert(`Gagal mengambil data donasi: ${err.message}`); // ❌ GANTI INI
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal mengambil data donasi: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
        setError(err.message); // Simpan pesan error untuk ditampilkan
      } finally {
        setLoading(false);
      }
    };

    fetchDonasiDetail();
  }, [id, navigate]);

  const handleKonfirmasi = async () => {
    // ✅ Ganti window.confirm dengan Swal.fire
    const result = await Swal.fire({
      title: 'Konfirmasi Donasi?',
      text: "Anda yakin ingin mengonfirmasi donasi ini?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981', // Hijau untuk konfirmasi
      cancelButtonColor: '#D1D5DB',  // Abu-abu untuk batal
      confirmButtonText: 'Ya, Konfirmasi!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login ulang.');
        }

        const res = await fetch(`/api/admin/donasi/${id}/konfirmasi`, { // Gunakan endpoint konfirmasi
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal mengonfirmasi donasi.');
        }

        const result = await res.json();
        // ✅ Ganti alert dengan Swal.fire
        Swal.fire({
          title: 'Berhasil!',
          text: result.message,
          icon: 'success',
          confirmButtonColor: '#FACC15',
        });
        setDonasi(prev => ({ ...prev, status: result.data.status, updated_at: result.data.updated_at }));

      } catch (err) {
        console.error('Error konfirmasi donasi:', err);
        // ✅ Ganti alert dengan Swal.fire
        Swal.fire({
          title: 'Gagal!',
          text: `Gagal mengonfirmasi donasi: ${err.message}`,
          icon: 'error',
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  const handleTolak = async () => {
    // ✅ Ganti window.confirm dengan Swal.fire
    const result = await Swal.fire({
      title: 'Tolak Donasi?',
      text: "Anda yakin ingin menolak donasi ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444', // Merah untuk tolak
      cancelButtonColor: '#D1D5DB',  // Abu-abu untuk batal
      confirmButtonText: 'Ya, Tolak!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login ulang.');
        }

        const res = await fetch(`/api/admin/donasi/${id}/tolak`, { // Gunakan endpoint tolak
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal menolak donasi.');
        }

        const result = await res.json();
        // ✅ Ganti alert dengan Swal.fire
        Swal.fire({
          title: 'Berhasil!',
          text: result.message,
          icon: 'success',
          confirmButtonColor: '#FACC15',
        });
        setDonasi(prev => ({ ...prev, status: result.data.status, updated_at: result.data.updated_at }));

      } catch (err) {
        console.error('Error menolak donasi:', err);
        // ✅ Ganti alert dengan Swal.fire
        Swal.fire({
          title: 'Gagal!',
          text: `Gagal menolak donasi: ${err.message}`,
          icon: 'error',
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-[#FDE68A]">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-[#D1FAE5]">
            <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> Divalidasi
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-[#FECACA]">
            <XCircle className="w-3 h-3 mr-1 text-red-500" /> Ditolak
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatRupiah = (number) => {
    if (!number) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!admin) {
    return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">Memuat...</div>;
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
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-8 text-center">
                    <p className="text-[#6B7280]">Memuat detail donasi...</p>
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

  if (error) {
    return (
      <>
        <div className="min-h-screen bg-[#F9FAFB]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
              <div className="w-64">
                <AdminSidebar admin={admin} />
              </div>
              <div className="flex-1">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-8 text-center">
                    <p className="text-red-500">Error: {error}</p>
                    <Button onClick={() => navigate(-1)} className="mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]">
                      Kembali
                    </Button>
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

  if (!donasi) {
    return (
      <>
        <div className="min-h-screen bg-[#F9FAFB]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
              <div className="w-64">
                <AdminSidebar admin={admin} />
              </div>
              <div className="flex-1">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-8 text-center">
                    <p className="text-[#6B7280]">Donasi tidak ditemukan.</p>
                    <Button onClick={() => navigate(-1)} className="mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]">
                      Kembali
                    </Button>
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
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/donasis`)} // Kembali ke daftar semua donasi
                        className="p-0 h-auto text-[#374151] border-[#FDE68A] hover:bg-[#FEF9C3]"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#374151]">
                          Detail Donasi #{donasi.id}
                        </CardTitle>
                        <p className="text-[#6B7280]">
                          Informasi lengkap tentang donasi pengguna
                        </p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(donasi.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Informasi Donasi */}
                    <div className="bg-[#FEF9C3]/30 p-6 rounded-lg border border-[#FDE68A]">
                      <h3 className="font-bold text-lg text-[#374151] mb-4">Informasi Donasi</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <p className="text-[#6B7280]">Nama Pendonor</p>
                          <p className="font-medium text-[#374151]">{donasi.nama || '-'}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-[#6B7280]">Email</p>
                          <p className="text-[#374151]">{donasi.email || '-'}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-[#6B7280]">Nominal</p>
                          <p className="font-bold text-[#374151]">{formatRupiah(donasi.nominal)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-[#6B7280]">Pesan</p>
                          <p className="italic text-[#374151] max-w-[150px] truncate">{donasi.pesan || '-'}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-[#6B7280]">Tanggal</p>
                          <p className="text-[#374151]">{formatDate(donasi.created_at)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-[#6B7280]">Kampanye</p>
                          <p className="text-[#374151]">{donasi.kampanye?.judul || 'Umum'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bukti Transfer */}
                    <div className="bg-[#FEF9C3]/30 p-6 rounded-lg border border-[#FDE68A]">
                      <h3 className="font-bold text-lg text-[#374151] mb-4">Bukti Transfer</h3>
                      <div className="flex justify-center items-center h-64 bg-[#FEF9C3]/50 rounded-md border border-[#FDE68A]">
                        {donasi.bukti_transfer_path ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="p-0 h-auto w-auto">
                                <img
                                  src={donasi.bukti_transfer_path}
                                  alt="Bukti Transfer"
                                  className="max-h-56 object-contain rounded-md"
                                />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Bukti Transfer</DialogTitle>
                              </DialogHeader>
                              <img
                                src={donasi.bukti_transfer_path}
                                alt="Bukti Transfer Besar"
                                className="w-full h-auto object-contain"
                              />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div className="text-center text-[#6B7280]">
                            <ImageIcon size={48} className="mx-auto mb-2 text-[#D1D5DB]" />
                            <p>Tidak ada bukti transfer.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  {donasi.status === 'pending' && (
                    <div className="mt-8 flex gap-4 justify-center">
                      <Button
                        onClick={handleKonfirmasi}
                        className="bg-[#10B981] hover:bg-[#059669] text-white"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Konfirmasi Donasi
                      </Button>
                      <Button
                        onClick={handleTolak}
                        variant="outline"
                        className="border-[#EF4444] text-[#EF4444] hover:bg-red-50 hover:text-red-700"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Tolak Donasi
                      </Button>
                    </div>
                  )}

                  <div className="mt-6 text-center text-sm text-[#6B7280]">
                    <p>Status terakhir diperbarui: {formatDate(donasi.updated_at)}</p>
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