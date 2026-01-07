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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#374151]">Memuat data peserta...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64">
            <AdminSidebar admin={JSON.parse(localStorage.getItem('user') || '{}')} />
          </div>
          <div className="flex-1">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/admin/kegiatans')}
                      className="mb-4 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Kembali ke Daftar Kegiatan
                    </Button>
                    <CardTitle className="text-2xl text-[#374151]">
                      Daftar Peserta - {kegiatan?.judul || 'Kegiatan'}
                    </CardTitle>
                    <p className="text-[#6B7280] mt-1">
                      Total: {peserta.length} peserta
                    </p>
                  </div>
                  <Button className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold">
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">No</TableHead>
                          <TableHead>Nama Lengkap</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Sekolah</TableHead>
                          <TableHead>Kelas</TableHead>
                          <TableHead>Jurusan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {peserta.map((p, index) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{p.full_name}</TableCell>
                            <TableCell>{p.email}</TableCell>
                            <TableCell>{p.school}</TableCell>
                            <TableCell>{p.grade}</TableCell>
                            <TableCell>{p.major || '-'}</TableCell>
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