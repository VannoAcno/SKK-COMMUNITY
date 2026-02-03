// resources/js/pages/admin/KampanyeDetail.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function KampanyeDetail() {
  const [admin, setAdmin] = useState(null);
  const [kampanye, setKampanye] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
    fetchKampanye();
  }, [id, navigate]);

  const fetchKampanye = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/donasi-kampanye/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Kampanye tidak ditemukan');
      const data = await res.json();
      setKampanye(data.data);
    } catch (err) {
      // alert('Gagal memuat detail kampanye.'); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memuat detail kampanye.',
        confirmButtonColor: '#FACC15',
      });
      navigate('/admin/donasis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // if (!confirm('Yakin hapus kampanye ini?')) return; // ❌ GANTI INI
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
        // alert('Kampanye berhasil dihapus.'); // ❌ GANTI INI
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kampanye berhasil dihapus.',
          confirmButtonColor: '#FACC15',
        });
        navigate('/admin/donasis');
      } catch (err) {
        // alert('Gagal menghapus kampanye.'); // ❌ GANTI INI
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: `Gagal menghapus kampanye: ${err.message}`,
          confirmButtonColor: '#FACC15',
        });
      }
    }
  };

  if (!admin || loading) {
    return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">Memuat...</div>;
  }

  const formatRupiah = (num) => num ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num) : '-';

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="w-64"><AdminSidebar admin={admin} /></div>
            <div className="flex-1">
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin/donasis')}
                    className="p-0 h-auto text-[#374151]"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1" /> Kembali
                  </Button>
                  <CardTitle className="text-2xl font-bold text-[#374151]">Detail Kampanye</CardTitle>
                </CardHeader>
                <CardContent>
                  {kampanye.gambar && (
                    <div className="mb-6">
                      <img
                        src={kampanye.gambar}
                        alt={kampanye.judul}
                        className="w-full max-w-md rounded-lg border border-[#E5E7EB] mx-auto"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-[#374151]">Judul</h3>
                      <p>{kampanye.judul}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#374151]">Deskripsi</h3>
                      <p className="text-[#6B7280]">{kampanye.deskripsi || '-'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#374151]">Target Dana</h3>
                      <p>{formatRupiah(kampanye.target)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#374151]">Status</h3>
                      <Badge variant={kampanye.is_active ? "default" : "secondary"}>
                        {kampanye.is_active ? 'Aktif' : 'Non-Aktif'}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#374151]">Dibuat</h3>
                      <p>{new Date(kampanye.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      onClick={() => navigate('/admin/donasis')}
                      variant="outline"
                      className="border-[#FDE68A] text-[#374151]"
                    >
                      Kembali ke Daftar
                    </Button>
                    <Button
                      onClick={() => navigate(`/admin/donasi/kampanye/${kampanye.id}/edit`)}
                      variant="outline"
                      className="border-[#FDE68A] text-[#374151]"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Hapus
                    </Button>
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