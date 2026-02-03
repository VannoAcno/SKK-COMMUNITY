// resources/js/pages/admin/EditKegiatan.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // Tambahkan import ini

export default function EditKampanye({
  open,
  onOpenChange,
  onSubmit,
  kampanye, // Data kampanye yang akan diedit
  errors = {},
}) {
  const { id } = useParams(); // Ambil ID dari URL jika diperlukan
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    target: '',
    gambar: null,
    is_active: true,
  });
  const [errorsLocal, setErrorsLocal] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (kampanye) {
      setFormData({
        judul: kampanye.judul || '',
        deskripsi: kampanye.deskripsi || '',
        target: kampanye.target ? String(kampanye.target) : '',
        gambar: null, // Jangan isi dengan path gambar lama
        is_active: Boolean(kampanye.is_active),
      });
    }
  }, [kampanye]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errorsLocal[name]) {
      setErrorsLocal(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, gambar: e.target.files[0] }));
    if (errorsLocal.gambar) {
      setErrorsLocal(prev => ({ ...prev, gambar: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorsLocal({});

    const apiData = new FormData();
    apiData.append('_method', 'PUT'); // Untuk Laravel untuk menandai ini adalah update
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '') {
        apiData.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/donasi-kampanyes/${kampanye.id}`, { // Gunakan ID dari props
        method: 'POST', // Karena FormData, kita tetap gunakan POST dengan _method
        headers: {
          'Authorization': `Bearer ${token}`,
          // Jangan set Content-Type, biarkan browser yang set dengan boundary
        },
        body: apiData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setErrorsLocal(result.errors);
        }
        throw new Error(result.message || 'Gagal memperbarui kampanye.');
      }

      // alert(result.message); // ❌ GANTI INI
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: result.message,
        confirmButtonColor: '#FACC15',
      });
      onOpenChange(false); // Tutup dialog
      onSubmit(); // Panggil fungsi untuk refresh data di parent

    } catch (err) {
      // alert(`Gagal memperbarui kampanye: ${err.message}`); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal memperbarui kampanye: ${err.message}`,
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#374151]">Edit Kampanye Donasi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="judul" className="text-[#374151]">Judul *</Label>
            <Input
              id="judul"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
              placeholder="Contoh: Bantuan untuk Korban Bencana"
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
            />
            {errorsLocal.judul && <p className="text-red-500 text-sm">{errorsLocal.judul[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-[#374151]">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="3"
              placeholder="Jelaskan tujuan dan manfaat dari kampanye ini..."
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
            />
            {errorsLocal.deskripsi && <p className="text-red-500 text-sm">{errorsLocal.deskripsi[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target" className="text-[#374151]">Target Dana (IDR)</Label>
            <Input
              id="target"
              name="target"
              type="number"
              value={formData.target}
              onChange={handleChange}
              placeholder="Contoh: 5000000"
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
            />
            {errorsLocal.target && <p className="text-red-500 text-sm">{errorsLocal.target[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gambar" className="text-[#374151]">Gambar Sampul (Opsional)</Label>
            <Input
              id="gambar"
              name="gambar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
            />
            {errorsLocal.gambar && <p className="text-red-500 text-sm">{errorsLocal.gambar[0]}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: Boolean(checked) }))}
              className="data-[state=checked]:bg-[#FACC15] data-[state=checked]:border-[#FACC15] mt-0.5"
            />
            <Label htmlFor="is_active" className="text-[#374151] text-sm font-normal cursor-pointer">Aktifkan kampanye ini</Label>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold"
              disabled={loading}
            >
              {loading ? 'Memperbarui...' : 'Perbarui'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}