// resources/js/pages/RiwayatDonasi.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { History, Download, ArrowLeft } from 'lucide-react';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function RiwayatDonasi() {
  const [user, setUser] = useState(null);
  const [donasiHistory, setDonasiHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !userData.id) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    fetchDonasiHistory(userData);
  }, [navigate]);

  // ✅ PERBAIKAN: Terima userData langsung, bukan userId
  const fetchDonasiHistory = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      // ✅ HAPUS parameter user_id karena backend tidak menggunakannya
      const res = await fetch('/api/donasi-success', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal mengambil riwayat donasi: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        // ✅ FILTER BERDASARKAN EMAIL ATAU NAMA (SOLUSI DARURAT)
        const userDonations = data.data.filter(d => {
          // Cocokkan email (case-insensitive)
          if (d.email && userData.email) {
            if (d.email.toLowerCase() === userData.email.toLowerCase()) {
              return true;
            }
          }
          // Cocokkan nama (case-insensitive)
          if (d.nama && userData.full_name) {
            if (d.nama.toLowerCase() === userData.full_name.toLowerCase()) {
              return true;
            }
          }
          return false;
        });
        
        console.log("Donasi ditemukan:", userDonations.length);
        setDonasiHistory(userDonations);
      } else {
        setError("Data donasi tidak tersedia");
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat donasi:', err);
      setError(`Gagal mengambil riwayat donasi: ${err.message}`);
    } finally {
      setLoading(false);
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
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const BOM = "\uFEFF";
    const separatorLine = "sep=,\n";
    const rows = [];
    rows.push(["No", "Tanggal", "Kampanye", "Nominal", "Status"]);
    
    donasiHistory.forEach((item, index) => {
      const no = index + 1;
      const tanggal = formatDate(item.created_at);
      const kampanye = item.kampanye?.judul || 'Donasi Umum';
      const nominal = item.nominal;
      const status = item.status;
      rows.push([no, tanggal, kampanye, nominal, status]);
    });
    
    const totalDonasi = donasiHistory.reduce((sum, item) => sum + (item.nominal || 0), 0);
    rows.push(["", "", "Total", totalDonasi, ""]);
    
    let csvContent = BOM + separatorLine;
    rows.forEach(row => {
      const formattedRow = row.map(cell => {
        if (typeof cell === 'number') {
          return cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return cell;
      });
      csvContent += formattedRow.join(",") + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `riwayat-donasi-${user?.full_name?.replace(/\s+/g, '_') || 'user'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <>
        <NavbarAfter user={user} />
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="text-[#374151]">Memuat riwayat donasi...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarAfter user={user} />
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <p className="text-gray-600 text-sm">
                <strong>Catatan:</strong> Data donasi tidak memiliki user_id di database.<br/>
                Sistem sedang menggunakan filter berdasarkan email/nama sebagai solusi darurat.
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              Refresh Halaman
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarAfter user={user} />
      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FACC15]/10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="text-[#374151] hover:text-[#FACC15] transition-colors p-2 rounded-full hover:bg-[#FACC15]/10"
                    aria-label="Kembali"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <CardTitle className="text-2xl text-[#374151] font-bold">
                    <History className="inline mr-2 text-[#FACC15]" /> Riwayat Donasi Anda
                  </CardTitle>
                </div>
                {donasiHistory.length > 0 && (
                  <Button
                    onClick={exportToCSV}
                    className="bg-[#10B981] hover:bg-[#0DA271] text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Download size={18} />
                    Export CSV
                  </Button>
                )}
              </div>
              <p className="text-[#6B7280] mt-2">
                Lihat riwayat donasi yang pernah Anda berikan kepada komunitas.
              </p>
            </CardHeader>
            <CardContent>
              {donasiHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-[#FACC15]/20">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151] w-12">No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151] min-w-[180px]">Tanggal</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151] min-w-[200px]">Kampanye</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151] min-w-[150px]">Nominal</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151] min-w-[100px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donasiHistory.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-sm text-[#374151] font-medium">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-[#374151] whitespace-nowrap">{formatDate(item.created_at)}</td>
                          <td className="px-4 py-3 text-sm text-[#374151]">{item.kampanye?.judul || 'Donasi Umum'}</td>
                          <td className="px-4 py-3 text-sm font-bold text-[#10B981] whitespace-nowrap">{formatRupiah(item.nominal)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'success' ? 'bg-green-100 text-green-700' :
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status === 'success' ? 'Berhasil' : 
                               item.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#FACC15]/20 font-bold">
                        <td className="px-4 py-3 text-sm text-[#374151]" colSpan="3">Total Donasi</td>
                        <td className="px-4 py-3 text-sm text-[#10B981]">
                          {formatRupiah(donasiHistory.reduce((sum, item) => sum + (item.nominal || 0), 0))}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#374151]"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="bg-[#FEF9C3] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="text-[#FACC15]" size={48} />
                  </div>
                  <p className="text-[#374151] text-xl font-bold mb-2">Belum Ada Riwayat Donasi</p>
                  <p className="text-[#6B7280] max-w-md mx-auto mb-6">
                    Anda belum pernah berdonasi. Mulai berdonasi sekarang untuk mendukung kegiatan komunitas kami!
                  </p>
                  <Link to="/donasi">
                    <Button className="bg-[#FACC15] hover:bg-[#e0b70a] text-black px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-shadow">
                      Lihat Kampanye Donasi
                    </Button>
                  </Link>
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