// resources/js/pages/admin/TransaksiKampanye.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function TransaksiKampanye() {
  const [admin, setAdmin] = useState(null);
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kampanyeInfo, setKampanyeInfo] = useState({ judul: '' });
  const [error, setError] = useState(null);
  const { id } = useParams(); // ID kampanye dari URL
  const navigate = useNavigate();

  useEffect(() => {
    // Cek otorisasi admin
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);

    const fetchKampanyeInfo = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/admin/donasi-kampanye/${id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          // const errorText = await res.text(); // Jika ingin pesan teks mentah
          throw new Error(`Gagal mengambil info kampanye: ${res.status}`); // Ganti alert
        }

        const data = await res.json();
        setKampanyeInfo({ judul: data.data.judul });

      } catch (err) {
        console.error('Error fetching kampanye info:', err);
        // alert(`Gagal mengambil info kampanye: ${err.message}`); // ❌ GANTI INI
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal mengambil info kampanye: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
        setError(err.message);
      }
    };

    const fetchTransaksi = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/admin/donasi', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          // const errorText = await res.text();
          throw new Error(`Gagal mengambil transaksi: ${res.status}`); // Ganti alert
        }

        const data = await res.json();
        const filteredTransaksi = data.data.filter(d => d.kampanye_id === parseInt(id));
        setTransaksi(filteredTransaksi);

      } catch (err) {
        console.error('Error fetching transaksi:', err);
        // alert(`Gagal mengambil transaksi: ${err.message}`); // ❌ GANTI INI
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal mengambil transaksi: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKampanyeInfo();
    fetchTransaksi();

  }, [id, navigate]);

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
                    <Button onClick={() => navigate(-1)}>Kembali</Button>
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
            <div className="w-64">
              <AdminSidebar admin={admin} />
            </div>
            <div className="flex-1">
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/donasis`)}
                      className="p-0 h-auto text-[#374151] border-[#FDE68A] hover:bg-[#FEF9C3]"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#374151]">
                        Transaksi: {kampanyeInfo.judul || 'Memuat...'}
                      </CardTitle>
                      <p className="text-[#6B7280]">
                        Daftar donasi untuk kampanye ini.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-[#6B7280]">
                      Memuat transaksi...
                    </div>
                  ) : transaksi.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] text-left text-[#6B7280] text-sm">
                            <th className="py-3 px-2">Pendonor</th>
                            <th className="py-3 px-2">Jumlah</th>
                            <th className="py-3 px-2">Pesan</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transaksi.map((t) => (
                            <tr
                              key={t.id}
                              className="border-b border-[#F3F4F6] hover:bg-[#FEF9C3]/20 cursor-pointer"
                              onClick={() => navigate(`/admin/donasis/${t.id}/detail`)}
                            >
                              <td className="py-4 px-2">
                                <div className="font-medium text-[#374151]">{t.nama}</div>
                                <div className="text-xs text-[#6B7280]">{t.email}</div>
                              </td>
                              <td className="py-4 px-2 font-medium">
                                {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                }).format(t.nominal)}
                              </td>
                              <td className="py-4 px-2 text-sm text-[#6B7280] max-w-xs truncate">
                                {t.pesan || '-'}
                              </td>
                              <td className="py-4 px-2">{getStatusBadge(t.status)}</td>
                              <td className="py-4 px-2 text-sm text-[#6B7280]">
                                {formatDate(t.created_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6B7280]">
                      Belum ada transaksi untuk kampanye ini.
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