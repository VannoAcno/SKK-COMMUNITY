import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, User, Users, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2';

export default function KegiatanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kegiatan, setKegiatan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPeserta, setIsPeserta] = useState(false);
  const [jumlahPeserta, setJumlahPeserta] = useState(0);

  // ✅ Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('id-ID');
  };

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/kegiatans/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        setKegiatan(data);
        setJumlahPeserta(data.peserta_count || 0);
      } catch (err) {
        console.error('Gagal ambil detail kegiatan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengambil detail kegiatan.',
          confirmButtonColor: '#FACC15',
        });
        navigate('/kegiatan');
      } finally {
        setLoading(false);
      }
    };

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/kegiatans/${id}/cek-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setIsPeserta(data.is_peserta);
      } catch (err) {
        console.error('Gagal cek status pendaftaran:', err);
      }
    };

    fetchKegiatan();
    fetchStatus();
  }, [id, navigate]);

  const handleDaftar = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/kegiatans/${id}/daftar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal mendaftar');
      }

      setIsPeserta(true);
      setJumlahPeserta(prev => prev + 1);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Anda telah terdaftar di kegiatan ini.',
        confirmButtonColor: '#FACC15',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.message,
        confirmButtonColor: '#FACC15',
      });
    }
  };

  const handleBatal = async () => {
    const result = await Swal.fire({
      title: 'Yakin ingin membatalkan pendaftaran?',
      text: 'Anda tidak akan ikut serta dalam kegiatan ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Batalkan!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/kegiatans/${id}/batal`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Gagal membatalkan pendaftaran');
        }

        setIsPeserta(false);
        setJumlahPeserta(prev => prev - 1);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pendaftaran Anda telah dibatalkan.',
          confirmButtonColor: '#FACC15',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: err.message,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#374151]">Memuat detail kegiatan...</div>
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar size={48} className="mx-auto mb-4 text-[#FACC15]" />
          <p className="text-[#374151]">Kegiatan tidak ditemukan.</p>
          <Button
            variant="outline"
            onClick={() => navigate('/kegiatan')}
            className="mt-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
          >
            Kembali ke Daftar Kegiatan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              {/* Tombol Kembali */}
              <Button
                variant="outline"
                onClick={() => navigate('/kegiatan')}
                className="mb-6 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
              >
                ← Kembali ke Daftar Kegiatan
              </Button>

              {/* Header Kegiatan */}
              <div className="mb-8">
                {kegiatan.gambar && (
                  <img
                    src={kegiatan.gambar}
                    alt={kegiatan.judul}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/800x400/FACC15/white?text=  ${encodeURIComponent(kegiatan.judul.substring(0, 20))}`;
                    }}
                  />
                )}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    kegiatan.tipe === 'agenda'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {kegiatan.tipe === 'agenda' ? 'Agenda' : 'Laporan'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#374151]">{kegiatan.judul}</h1>
              </div>

              {/* Detail Kegiatan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-sm bg-[#FEF9C3]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center">
                        <Calendar size={20} className="text-white" />
                      </div>
                      <div>
                        <Label className="text-[#6B7280] text-sm">Tanggal</Label>
                        <p className="font-medium text-[#374151]">
                          {formatDate(kegiatan.tanggal_mulai)}
                          {kegiatan.tanggal_selesai && (
                            <>
                              {' '}→{' '}
                              {formatDate(kegiatan.tanggal_selesai)}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-[#FEF9C3]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div>
                        <Label className="text-[#6B7280] text-sm">Lokasi</Label>
                        <p className="font-medium text-[#374151]">{kegiatan.lokasi || '—'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-[#FEF9C3]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                        <Users size={20} className="text-white" />
                      </div>
                      <div>
                        <Label className="text-[#6B7280] text-sm">Peserta</Label>
                        <p className="font-medium text-[#374151]">{jumlahPeserta} orang</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Deskripsi */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#374151] mb-4">Deskripsi Kegiatan</h2>
                <div className="prose max-w-none text-[#374151] bg-white p-6 rounded-lg border border-[#FDE68A]">
                  <p>{kegiatan.deskripsi || 'Tidak ada deskripsi.'}</p>
                </div>
              </div>

              {/* Aksi (jika user login) */}
              {localStorage.getItem('auth_token') && (
                <div className="flex gap-3">
                  {/* ✅ Hanya tampilkan tombol daftar jika tipe adalah 'agenda' */}
                  {kegiatan.tipe === 'agenda' && (
                    <>
                      {!isPeserta ? (
                        <Button
                          className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                          onClick={handleDaftar}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Daftar Ikut Kegiatan
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="border-[#FDE68A] text-red-500 hover:bg-red-50 font-semibold"
                          onClick={handleBatal}
                        >
                          <XCircle size={16} className="mr-2" />
                          Batalkan Pendaftaran
                        </Button>
                      )}
                    </>
                  )}
                  <Button variant="outline" className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]">
                    Bagikan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}