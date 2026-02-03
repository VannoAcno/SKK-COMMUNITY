// resources/js/pages/admin/EditAlbum.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function EditAlbum() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal_pembuatan: '',
    gambar_cover: null,
  });

  const [albumData, setAlbumData] = useState(null);

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
        tanggal_pembuatan: data.tanggal_pembuatan ? data.tanggal_pembuatan.split('T')[0] : '', // Format tanggal untuk input
        gambar_cover: null, // Jangan isi dengan path gambar lama
      });
    } catch (err) {
      console.error('Gagal mengambil album:', err);
      // alert(`Gagal mengambil data album: ${err.message}`); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal mengambil data album: ${err.message}`,
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
      apiData.append('_method', 'PUT'); // Untuk Laravel PATCH/PUT via POST
      apiData.append('judul', formData.judul);
      if (formData.deskripsi) apiData.append('deskripsi', formData.deskripsi);
      if (formData.tanggal_pembuatan) apiData.append('tanggal_pembuatan', formData.tanggal_pembuatan);
      if (formData.gambar_cover) apiData.append('gambar_cover', formData.gambar_cover);

      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/albums/${albumId}`, {
        method: 'POST', // Karena FormData, pakai POST dengan _method
        headers: { 'Authorization': `Bearer ${token}` },
        body: apiData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setErrors(result.errors);
        }
        throw new Error(result.message || 'Gagal mengedit album');
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
      // alert(`Gagal mengedit album: ${err.message}`); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal mengedit album: ${err.message}`,
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#F9FAFB]"> {/* Ganti warna latar belakang */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
              <div className="w-64">
                <AdminSidebar admin={JSON.parse(localStorage.getItem('user') || '{}')} />
              </div>
              <div className="flex-1">
                <Card className="border-0 shadow-sm bg-white"> {/* Gaya card */}
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
        <Footer />
      </>
    );
  }

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
                  <CardTitle className="text-2xl text-[#374151] font-bold">Edit Album</CardTitle>
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
                        placeholder="Contoh: Retret Pemuda 2025"
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
                      {errors.gambar_cover && <p className="text-red-500 text-sm mt-1">{errors.gambar_cover[0]}</p>}

                      {/* Tampilkan cover lama jika tidak ada file baru dipilih */}
                      {albumData?.gambar_cover && !formData.gambar_cover && (
                        <div className="mt-4">
                          <p className="text-sm text-[#6B7280] mb-2">Cover album saat ini:</p>
                          <img
                            src={albumData.gambar_cover}
                            alt="Cover saat ini"
                            className="w-32 h-32 object-cover rounded-lg border border-[#FDE68A]"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden items-center justify-center w-32 h-32 bg-[#FEF9C3] rounded-lg border border-[#FDE68A]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-[#9CA3AF]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h6V4m0 0H8v4m0 0l2-2m2 2l-2 2"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
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
      <Footer />
    </>
  );
}