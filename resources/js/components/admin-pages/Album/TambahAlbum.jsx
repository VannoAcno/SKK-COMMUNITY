// resources/js/components/admin-pages/Album/TambahAlbumPage.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function TambahAlbum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal_pembuatan: '',
    gambar_cover: null,
  });

  const [errors, setErrors] = useState({});

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
      if (formData.deskripsi) apiData.append('deskripsi', formData.deskripsi);
      if (formData.tanggal_pembuatan) apiData.append('tanggal_pembuatan', formData.tanggal_pembuatan);
      if (formData.gambar_cover) apiData.append('gambar_cover', formData.gambar_cover);

      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/albums', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: apiData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 422 && result.errors) {
          setErrors(result.errors);
        } else {
          throw new Error(result.message || 'Gagal membuat album');
        }
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Album berhasil ditambahkan.',
        confirmButtonColor: '#FACC15',
      });
      navigate('/admin/galeris');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat membuat album.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

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
                <CardTitle className="text-2xl text-[#374151]">Buat Album Baru</CardTitle>
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
                      Upload Cover Album (Opsional)
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
                            {formData.gambar_cover ? formData.gambar_cover.name : 'Klik untuk upload cover album'}
                          </p>
                          <p className="text-xs text-[#6B7280]/70 mt-1">Max 2MB, JPG/PNG</p>
                        </div>
                      </div>
                    </div>
                    {errors.gambar_cover && <p className="text-red-500 text-sm">{errors.gambar_cover[0]}</p>}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin/galeris')}
                      className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                    >
                      {loading ? 'Membuat...' : 'Buat Album'}
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