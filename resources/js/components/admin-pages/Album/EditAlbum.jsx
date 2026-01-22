// resources/js/components/admin-pages/Album/EditAlbumPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function EditAlbum() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal_pembuatan: '',
    gambar_cover: null,
  });

  const [albumData, setAlbumData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAlbumData();
  }, [albumId]);

  const fetchAlbumData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/albums/${albumId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal memuat data album');
      const data = await res.json();
      setAlbumData(data);
      setFormData({
        judul: data.judul,
        deskripsi: data.deskripsi || '',
        tanggal_pembuatan: data.tanggal_pembuatan || '',
        gambar_cover: null,
      });
    } catch (err) {
      console.error('Gagal mengambil album:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data album.',
        confirmButtonColor: '#FACC15',
      });
      navigate('/admin/albums');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File terlalu besar',
          text: 'Max 2MB per file.',
          confirmButtonColor: '#FACC15',
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, gambar_cover: file }));
      if (errors.gambar_cover) {
        setErrors(prev => ({ ...prev, gambar_cover: undefined }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.judul?.trim()) newErrors.judul = ['Judul wajib diisi.'];
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      const apiData = new FormData();
      apiData.append('judul', formData.judul);
      apiData.append('deskripsi', formData.deskripsi);
      apiData.append('tanggal_pembuatan', formData.tanggal_pembuatan);
      if (formData.gambar_cover) {
        apiData.append('gambar_cover', formData.gambar_cover);
      }
      // Tambahkan _method untuk PATCH
      apiData.append('_method', 'PATCH');

      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/albums/${albumId}`, {
        method: 'POST', // Karena Laravel tidak support PATCH via FormData
        headers: { 'Authorization': `Bearer ${token}` },
        body: apiData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 422 && result.errors) {
          setErrors(result.errors);
        } else {
          throw new Error(result.message || 'Gagal mengedit album');
        }
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Album berhasil diedit.',
        confirmButtonColor: '#FACC15',
      });
      navigate('/admin/albums');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat mengedit album.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
                  <CardTitle className="text-2xl text-[#374151]">Edit Album</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-[#374151]">Memuat data album...</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
                <CardTitle className="text-2xl text-[#374151]">Edit Album</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="judul" className="text-[#374151]">
                      Judul Album <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="judul"
                      value={formData.judul}
                      onChange={(e) => handleChange('judul', e.target.value)}
                      placeholder="Contoh: Perayaan Paskah 2026"
                      className={errors.judul ? 'border-red-500' : ''}
                    />
                    {errors.judul && <p className="text-red-500 text-sm">{errors.judul[0]}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tanggal_pembuatan" className="text-[#374151]">
                      Tanggal Pembuatan (Opsional)
                    </Label>
                    <Input
                      id="tanggal_pembuatan"
                      type="date"
                      value={formData.tanggal_pembuatan}
                      onChange={(e) => handleChange('tanggal_pembuatan', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deskripsi" className="text-[#374151]">
                      Deskripsi (Opsional)
                    </Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => handleChange('deskripsi', e.target.value)}
                      placeholder="Deskripsikan album ini..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gambar_cover" className="text-[#374151]">
                      Upload Cover Album Baru (Opsional)
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="relative border-2 border-dashed border-[#FDE68A] rounded-lg p-8 text-center cursor-pointer group">
                        <input
                          id="gambar_cover"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                          <Camera size={48} className="text-[#FACC15] mb-2 group-hover:text-[#EAB308]" />
                          <p className="text-sm text-[#6B7280]">
                            {formData.gambar_cover ? formData.gambar_cover.name : 'Klik untuk upload cover album baru'}
                          </p>
                          <p className="text-xs text-[#6B7280]/70 mt-1">Max 2MB, JPG/PNG</p>
                        </div>
                      </div>
                    </div>
                    {errors.gambar_cover && <p className="text-red-500 text-sm">{errors.gambar_cover[0]}</p>}
                    
                    {/* Tampilkan cover lama jika ada */}
                    {albumData?.gambar_cover && !formData.gambar_cover && (
                      <div className="mt-4">
                        <p className="text-sm text-[#6B7280] mb-2">Cover album saat ini:</p>
                        <img
                          src={albumData.gambar_cover}
                          alt="Cover saat ini"
                          className="w-32 h-32 object-cover rounded-lg border border-[#FDE68A]"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(albumData.judul || 'Album')}&background=FACC15&color=ffffff`;
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin/albums')}
                      className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                    >
                      {loading ? 'Mengedit...' : 'Simpan Perubahan'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}