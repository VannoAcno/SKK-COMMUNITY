// resources/js/pages/admin/TambahAlbum.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function TambahAlbum() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal_pembuatan: '',
    gambar_cover: null,
  });

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
        // alert('File terlalu besar. Max 2MB.'); // ❌ GANTI INI
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
      const res = await fetch('/api/admin/albums', { // Endpoint untuk create
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: apiData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setErrors(result.errors);
        }
        throw new Error(result.message || 'Gagal membuat album');
      }

      // alert(result.message); // ❌ GANTI INI
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: result.message,
        confirmButtonColor: '#FACC15',
      });
      navigate('/admin/albums');
    } catch (err) {
      // alert(`Gagal membuat album: ${err.message}`); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal membuat album: ${err.message}`,
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]"> {/* Ganti warna latar belakang */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="w-64">
              <AdminSidebar admin={JSON.parse(localStorage.getItem('user') || '{}')} />
            </div>
            <div className="flex-1">
              <Card className="border-0 shadow-lg bg-white"> {/* Gaya card */}
                <CardHeader>
                  <CardTitle className="text-2xl text-[#374151] font-bold">Buat Album Baru</CardTitle>
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
                        required
                        placeholder="Contoh: Perayaan Paskah 2026"
                        className={`border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 ${errors.judul ? 'border-red-500' : ''}`} // Gaya input
                      />
                      {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul[0]}</p>}
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
                        className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0" // Gaya input
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
                        className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0" // Gaya textarea
                      />
                      {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi[0]}</p>}
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
                      {errors.gambar_cover && <p className="text-red-500 text-sm mt-1">{errors.gambar_cover[0]}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/albums')}
                        className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]" // Gaya button
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold shadow-md hover:shadow-lg transition-shadow" // Gaya button
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
      <Footer />
    </>
  );
}