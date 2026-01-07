// resources/js/pages/admin/TambahKegiatan.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

// ✅ DIPERBAIKI: Hapus spasi di akhir URL
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Tambah+Kegiatan&background=FACC15&color=ffffff&size=128';

export default function TambahKegiatan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    lokasi: '',
    tipe: 'agenda',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.judul.trim()) newErrors.judul = ['Judul wajib diisi.'];
    if (!formData.tanggal_mulai) newErrors.tanggal_mulai = ['Tanggal mulai wajib diisi.'];
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
      apiData.append('tanggal_mulai', formData.tanggal_mulai);
      if (formData.tanggal_selesai) apiData.append('tanggal_selesai', formData.tanggal_selesai);
      if (formData.lokasi) apiData.append('lokasi', formData.lokasi);
      apiData.append('tipe', formData.tipe);
      if (avatarFile) apiData.append('gambar', avatarFile);

      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/kegiatans', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: apiData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 422 && result.errors) {
          setErrors(result.errors);
        } else {
          throw new Error(result.message || 'Gagal menambahkan kegiatan');
        }
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kegiatan berhasil ditambahkan.',
        confirmButtonColor: '#FACC15',
      });

      navigate('/admin/kegiatans');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat menambahkan kegiatan.',
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
                <CardTitle className="text-2xl text-[#374151]">Tambah Kegiatan Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Foto Kegiatan */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                      <img
                        src={avatarPreview}
                        alt="Preview Gambar"
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                      />
                    </div>
                    <Label className="cursor-pointer text-[#FACC15] hover:underline flex items-center gap-1">
                      <Upload size={16} />
                      Ganti Gambar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </Label>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="judul" className="text-[#374151]">
                        Judul Kegiatan <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="judul"
                        value={formData.judul}
                        onChange={(e) => handleChange('judul', e.target.value)}
                        placeholder="Contoh: Retret Pemuda 2025"
                        className={errors.judul ? 'border-red-500' : ''}
                      />
                      {errors.judul && <p className="text-red-500 text-sm">{errors.judul[0]}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#374151]">Tipe Kegiatan</Label>
                      <Select value={formData.tipe} onValueChange={(v) => handleChange('tipe', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agenda">Agenda (Akan Datang)</SelectItem>
                          <SelectItem value="laporan">Laporan (Sudah Lewat)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tanggal_mulai" className="text-[#374151]">
                        Tanggal Mulai <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                        <Input
                          id="tanggal_mulai"
                          type="date"
                          value={formData.tanggal_mulai}
                          onChange={(e) => handleChange('tanggal_mulai', e.target.value)}
                          className={`pl-10 ${errors.tanggal_mulai ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.tanggal_mulai && <p className="text-red-500 text-sm">{errors.tanggal_mulai[0]}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tanggal_selesai" className="text-[#374151]">Tanggal Selesai</Label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                        <Input
                          id="tanggal_selesai"
                          type="date"
                          value={formData.tanggal_selesai}
                          onChange={(e) => handleChange('tanggal_selesai', e.target.value)}
                          min={formData.tanggal_mulai || ''}
                          className="pl-10"
                        />
                      </div>
                      {errors.tanggal_selesai && <p className="text-red-500 text-sm">{errors.tanggal_selesai[0]}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lokasi" className="text-[#374151]">Lokasi</Label>
                      <Input
                        id="lokasi"
                        value={formData.lokasi}
                        onChange={(e) => handleChange('lokasi', e.target.value)}
                        placeholder="Contoh: Villa Bukit Berbunga, Batu"
                        className={errors.lokasi ? 'border-red-500' : ''}
                      />
                      {errors.lokasi && <p className="text-red-500 text-sm">{errors.lokasi[0]}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="deskripsi" className="text-[#374151]">Deskripsi</Label>
                      <Textarea
                        id="deskripsi"
                        value={formData.deskripsi}
                        onChange={(e) => handleChange('deskripsi', e.target.value)}
                        placeholder="Deskripsikan kegiatan..."
                        rows={4}
                        className={errors.deskripsi ? 'border-red-500' : ''}
                      />
                      {errors.deskripsi && <p className="text-red-500 text-sm">{errors.deskripsi[0]}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin/kegiatans')}
                      className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
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