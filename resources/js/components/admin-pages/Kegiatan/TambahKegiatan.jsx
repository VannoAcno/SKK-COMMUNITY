import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function TambahKegiatan() {
  const navigate = useNavigate();
  const [kegiatan, setKegiatan] = useState({
    judul: '',
    deskripsi: '',
    lokasi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    tipe: 'agenda',
    is_active: true,
    gambar: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setKegiatan(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        Swal.fire({
          icon: 'error',
          title: 'Format Tidak Valid',
          text: 'Harap pilih file gambar (jpg, png, jpeg)',
          confirmButtonColor: '#FACC15'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Ukuran Terlalu Besar',
          text: 'Ukuran maksimal 5MB',
          confirmButtonColor: '#FACC15'
        });
        return;
      }

      setKegiatan(prev => ({
        ...prev,
        gambar: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      
      formData.append('judul', kegiatan.judul);
      formData.append('deskripsi', kegiatan.deskripsi);
      formData.append('lokasi', kegiatan.lokasi);
      formData.append('tanggal_mulai', kegiatan.tanggal_mulai);
      formData.append('tanggal_selesai', kegiatan.tanggal_selesai);
      formData.append('tipe', kegiatan.tipe);
      formData.append('is_active', kegiatan.is_active ? '1' : '0');
      
      if (kegiatan.gambar) {
        formData.append('gambar', kegiatan.gambar);
      }

      const response = await fetch('/api/admin/kegiatans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambah kegiatan');
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kegiatan berhasil ditambahkan',
        confirmButtonColor: '#FACC15'
      });
      
      navigate('/admin/kegiatans');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message,
        confirmButtonColor: '#FACC15'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#374151]">Tambah Kegiatan Baru</CardTitle>
            <p className="text-[#6B7280]">Buat kegiatan baru untuk SKK Community</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Judul */}
              <div className="space-y-2">
                <Label htmlFor="judul" className="text-[#374151]">Judul Kegiatan *</Label>
                <Input
                  id="judul"
                  name="judul"
                  value={kegiatan.judul}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Perayaan Paskah 2026"
                  className="border-[#E5E7EB] focus:border-[#FACC15] focus:ring-[#FACC15]"
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label htmlFor="deskripsi" className="text-[#374151]">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={kegiatan.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Jelaskan detail kegiatan..."
                  className="border-[#E5E7EB] focus:border-[#FACC15] focus:ring-[#FACC15]"
                />
              </div>

              {/* Gambar */}
              <div className="space-y-2">
                <Label className="text-[#374151]">Gambar Kegiatan (Opsional)</Label>
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center hover:border-[#FACC15] transition-colors">
                  {kegiatan.gambar ? (
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(kegiatan.gambar)} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setKegiatan(prev => ({ ...prev, gambar: null }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-[#6B7280] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-[#6B7280] mb-2">Pilih gambar untuk diupload</p>
                      <label className="bg-[#FACC15] hover:bg-[#e0b70a] text-black px-4 py-2 rounded-md cursor-pointer transition-colors">
                        Pilih Gambar
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-[#6B7280] mt-2">Maks 5MB (JPG, PNG, JPEG)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_mulai" className="text-[#374151]">Tanggal Mulai *</Label>
                  <Input
                    id="tanggal_mulai"
                    name="tanggal_mulai"
                    type="date"
                    value={kegiatan.tanggal_mulai}
                    onChange={handleChange}
                    required
                    className="border-[#E5E7EB] focus:border-[#FACC15] focus:ring-[#FACC15]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_selesai" className="text-[#374151]">Tanggal Selesai</Label>
                  <Input
                    id="tanggal_selesai"
                    name="tanggal_selesai"
                    type="date"
                    value={kegiatan.tanggal_selesai}
                    onChange={handleChange}
                    className="border-[#E5E7EB] focus:border-[#FACC15] focus:ring-[#FACC15]"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-2">
                <Label htmlFor="lokasi" className="text-[#374151]">Lokasi</Label>
                <Input
                  id="lokasi"
                  name="lokasi"
                  value={kegiatan.lokasi}
                  onChange={handleChange}
                  placeholder="Contoh: Gereja SKK"
                  className="border-[#E5E7EB] focus:border-[#FACC15] focus:ring-[#FACC15]"
                />
              </div>

              {/* Tipe */}
              <div className="space-y-2">
                <Label htmlFor="tipe" className="text-[#374151]">Tipe Kegiatan *</Label>
                <Select
                  value={kegiatan.tipe}
                  onValueChange={(value) => setKegiatan(prev => ({ ...prev, tipe: value }))}
                >
                  <SelectTrigger className="border-[#E5E7EB] focus:border-[#FACC15] focus:ring-[#FACC15]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agenda">Agenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ✅ CHECKBOX is_active DIPERBAIKI */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={kegiatan.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#FACC15] border-[#E5E7EB] rounded focus:ring-[#FACC15] focus:ring-offset-0"
                  />
                  <Label htmlFor="is_active" className="text-[#374151] font-medium">
                    Aktifkan kegiatan ini
                  </Label>
                </div>
                <p className="text-xs text-[#6B7280] ml-6">
                  {kegiatan.is_active ? '✓ Kegiatan akan ditampilkan di halaman publik' : '✗ Kegiatan tidak akan ditampilkan di halaman publik'}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => navigate('/admin/kegiatans')}
                  variant="outline"
                  className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold flex-1"
                >
                  Simpan Kegiatan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}