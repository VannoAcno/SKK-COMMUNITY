import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { QrCode, Upload, CheckCircle, Target } from 'lucide-react';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function DonasiDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [kampanye, setKampanye] = useState(null);
  const [donasis, setDonasis] = useState([]);
  const [loading, setLoading] = useState({ kampanye: true, donasis: true });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      setUser(userData);
    }

    const fetchKampanye = async () => {
      setLoading(prev => ({ ...prev, kampanye: true }));
      try {
        const res = await fetch(`/api/donasi-kampanyes/${id}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data kampanye: ${res.status}`);
        }

        const data = await res.json();
        // ✅ PERBAIKAN: Mengambil dari data.data sesuai format API
        setKampanye(data.data);
      } catch (err) {
        console.error('Gagal mengambil detail kampanye:', err);
        alert(`Gagal mengambil detail kampanye: ${err.message}`);
        navigate('/donasi');
      } finally {
        setLoading(prev => ({ ...prev, kampanye: false }));
      }
    };

    const fetchDonasisForKampanye = async () => {
      setLoading(prev => ({ ...prev, donasis: true }));
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/donasi-success', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data donasi: ${res.status}`);
        }

        const data = await res.json();
        const donasiForThisCampaign = data.data.filter(d => d.kampanye_id === parseInt(id));
        setDonasis(donasiForThisCampaign);
      } catch (err) {
        console.error('Gagal mengambil data donasi untuk kampanye:', err);
        alert(`Gagal mengambil data donasi untuk kampanye: ${err.message}`);
        navigate('/donasi');
      } finally {
        setLoading(prev => ({ ...prev, donasis: false }));
      }
    };

    fetchKampanye();
    fetchDonasisForKampanye();
  }, [id, navigate]);

  const formatRupiah = (number) => {
    if (!number) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (loading.kampanye) {
    return (
      <>
        <NavbarAfter user={user} />
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="text-[#374151]">Memuat detail kampanye...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!kampanye) {
    return (
      <>
        <NavbarAfter user={user} />
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="text-[#374151]">Kampanye tidak ditemukan.</div>
        </div>
        <Footer />
      </>
    );
  }

  const totalDonasi = donasis.reduce((sum, donasi) => sum + donasi.nominal, 0);

  return (
    <>
      <NavbarAfter user={user} />
      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FACC15]/10 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-[#374151] font-bold">{kampanye.judul}</CardTitle>
              {/* ✅ PERBAIKAN: Tampilkan status dengan benar */}
              <p className="text-[#6B7280]">
                {kampanye.is_active ? 'Kampanye Aktif' : 'Kampanye Tidak Aktif'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  {kampanye.gambar ? (
                    <img
                      src={kampanye.gambar}
                      alt={kampanye.judul}
                      className="w-full h-64 object-cover rounded-md border border-[#FDE68A]"
                    />
                  ) : (
                    <div className="w-full h-64 bg-[#FEF9C3] flex items-center justify-center rounded-md border border-[#FDE68A]">
                      <span className="text-[#D1D5DB]">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2">
                  <h3 className="font-bold text-xl text-[#374151] mb-4">Tentang Kampanye</h3>
                  <p className="text-[#6B7280] mb-6">{kampanye.deskripsi}</p>
                  <div className="bg-[#FEF9C3]/50 p-4 rounded-md border border-[#FDE68A]">
                    <p className="text-[#374151] font-medium">Target Dana: <span className="font-bold">{formatRupiah(kampanye.target)}</span></p>
                    <p className="text-[#374151] font-medium">Total Terkumpul: <span className="font-bold">{formatRupiah(totalDonasi)}</span></p>
                    <p className="text-[#374151] font-medium">Jumlah Donatur: <span className="font-bold">{donasis.length}</span></p>
                  </div>
                  <div className="mt-6">
                    {/* ✅ PERBAIKAN: Nonaktifkan tombol jika kampanye tidak aktif */}
                    <Button
                      className="w-full bg-[#FACC15] hover:bg-[#e0b70a] text-black"
                      onClick={() => navigate(`/donasi/form`, { state: { kampanyeId: id, kampanyeJudul: kampanye.judul } })}
                      disabled={!kampanye.is_active}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      {kampanye.is_active ? 'Donasi untuk Kampanye Ini' : 'Kampanye Tidak Aktif'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Riwayat Donasi */}
              <div className="mt-8">
                <h3 className="font-bold text-xl text-[#374151] mb-4">Riwayat Donasi</h3>
                {loading.donasis ? (
                  <div className="text-center py-8 text-[#6B7280]">
                    Memuat riwayat donasi...
                  </div>
                ) : donasis.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#FEF9C3]">
                      <thead className="bg-[#FEF9C3]/30">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Nama</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Nominal</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Pesan</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#FEF9C3]">
                        {donasis.map((d) => (
                          <tr key={d.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#374151]">{d.nama}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-[#374151]">{formatRupiah(d.nominal)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-[#6B7280]">{d.pesan || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-[#6B7280]">{new Date(d.created_at).toLocaleDateString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#6B7280]">
                    Belum ada donasi masuk untuk kampanye ini.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}