// resources/js/pages/admin/DaftarPesertaKegiatan.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function DaftarPesertaKegiatan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kegiatan, setKegiatan] = useState(null);
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/admin/kegiatans/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal mengambil data kegiatan');
        const data = await res.json();
        setKegiatan(data);
      } catch (err) {
        console.error('Gagal ambil kegiatan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengambil data kegiatan.',
          confirmButtonColor: '#FACC15',
        });
        navigate('/admin/kegiatans');
      }
    };

    const fetchPeserta = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/admin/kegiatans/${id}/peserta`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal mengambil data peserta');
        const data = await res.json();
        setPeserta(data);
      } catch (err) {
        console.error('Gagal ambil peserta:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengambil data peserta.',
          confirmButtonColor: '#FACC15',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatan();
    fetchPeserta();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center"> {/* Ganti warna latar belakang */}
        <div className="text-[#374151]">Memuat data peserta...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]"> {/* Ganti warna latar belakang */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64">
            <AdminSidebar admin={JSON.parse(localStorage.getItem('user') || '{}')} />
          </div>
          <div className="flex-1">
            <Card className="border-0 shadow-lg bg-white"> {/* Gaya card */}
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/admin/kegiatans')}
                      className="mb-2 md:mb-0 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] shadow-sm hover:shadow-md transition-shadow" // Gaya button
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Kembali ke Daftar Kegiatan
                    </Button>
                    <CardTitle className="text-2xl text-[#374151] font-bold mt-2 md:mt-0">
                      Daftar Peserta - {kegiatan?.judul || 'Kegiatan'}
                    </CardTitle>
                    <p className="text-[#6B7280] mt-1">
                      Total: {peserta.length} peserta
                    </p>
                  </div>
                  <Button className="bg-[#FACC15] text-black hover:bg-[#e0b70a] font-semibold shadow-md hover:shadow-lg transition-shadow"> {/* Gaya button */}
                    <Download size={16} className="mr-2" />
                    Export Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {peserta.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto mb-4 text-[#FACC15]" />
                    <p className="text-[#6B7280]">Belum ada peserta yang mendaftar.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-[#FDE68A]"> {/* Tambahkan border dan rounded untuk tabel */}
                    <Table className="min-w-full divide-y divide-[#FEF9C3]">
                      <TableHeader className="bg-[#FEF9C3]/30">
                        <TableRow>
                          <TableHead className="w-[60px] px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">No</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Nama Lengkap</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Email</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Sekolah</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Kelas</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#374151] uppercase tracking-wider">Jurusan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white divide-y divide-[#FEF9C3]">
                        {peserta.map((p, index) => (
                          <TableRow key={p.id} className="hover:bg-[#FEF9C3]/10"> {/* Gaya hover baris */}
                            <TableCell className="px-4 py-3 whitespace-nowrap font-medium text-[#374151]">{index + 1}</TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-[#374151]">{p.full_name}</TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-[#374151]">{p.email}</TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-[#374151]">{p.school}</TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-[#374151]">{p.grade}</TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-[#374151]">{p.major || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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