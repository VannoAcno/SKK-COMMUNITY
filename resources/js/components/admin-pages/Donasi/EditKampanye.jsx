// resources/js/pages/admin/EditKampanye.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function EditKampanye({
  open,
  onOpenChange,
  onSubmit,
  kampanye,
  errors = {},
}) {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    target: '',
    gambar: null,
    is_active: true,
  });

  const [gambarLama, setGambarLama] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (kampanye) {
      setFormData({
        judul: kampanye.judul || '',
        deskripsi: kampanye.deskripsi || '',
        target: kampanye.target ? String(kampanye.target) : '',
        gambar: null,
        is_active: Boolean(kampanye.is_active),
      });
      setGambarLama(kampanye.gambar || null);
      setPreviewUrl(null);
    }
  }, [kampanye]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, gambar: file }));
    } else {
      setPreviewUrl(null);
      setFormData(prev => ({ ...prev, gambar: null }));
    }
  };

  const handleRemoveImage = () => {
    setGambarLama(null);
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, gambar: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const fd = new FormData();
    fd.append('_method', 'PUT');
    fd.append('judul', formData.judul);
    if (formData.deskripsi) fd.append('deskripsi', formData.deskripsi);
    if (formData.target) fd.append('target', formData.target);
    fd.append('is_active', formData.is_active ? '1' : '0');
    if (formData.gambar) fd.append('gambar', formData.gambar);

    try {
      const res = await fetch(`/api/admin/donasi-kampanye/${kampanye.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });

      const result = await res.json();
      if (!res.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.message || 'Gagal memperbarui.');
      }

      // alert(result.message); // ❌ GANTI INI
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: result.message,
        confirmButtonColor: '#FACC15',
      });
      onOpenChange(false);
      onSubmit(); // Refresh parent list
    } catch (err) {
      // alert(`Gagal memperbarui: ${err.message}`); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal memperbarui: ${err.message}`,
        confirmButtonColor: '#FACC15',
      });
    }
  };

  if (!kampanye) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#374151]">Edit Kampanye Donasi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="judul" className="text-[#374151] block mb-1">Judul *</Label>
            <Input
              id="judul"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
              placeholder="Contoh: Bantuan untuk Korban Bencana"
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 w-full"
            />
            {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-[#374151] block mb-1">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="3"
              placeholder="Jelaskan tujuan dan manfaat dari kampanye ini..."
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 w-full"
            />
            {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target" className="text-[#374151] block mb-1">Target Dana (IDR)</Label>
            <Input
              id="target"
              name="target"
              type="number"
              value={formData.target}
              onChange={handleChange}
              placeholder="Contoh: 5000000"
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 w-full"
            />
            {errors.target && <p className="text-red-500 text-sm mt-1">{errors.target[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[#374151] block mb-1">Gambar Sampul (Opsional)</Label>
            <p className="text-xs text-[#6B7280] mb-2">
              Kosongkan jika tidak ingin mengganti gambar.
            </p>

            {gambarLama && !previewUrl && (
              <div className="relative mb-2">
                <img
                  src={gambarLama}
                  alt="Preview gambar lama"
                  className="w-full h-24 object-cover rounded-md border border-[#FDE68A]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 rounded-full p-1"
                  title="Hapus gambar"
                >
                  <X size={12} />
                </Button>
              </div>
            )}

            {previewUrl && (
              <div className="relative mb-2">
                <img
                  src={previewUrl}
                  alt="Preview gambar baru"
                  className="w-full h-24 object-cover rounded-md border border-[#FDE68A]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setPreviewUrl(null);
                    setFormData(prev => ({ ...prev, gambar: null }));
                  }}
                  className="absolute -top-2 -right-2 rounded-full p-1"
                  title="Batalkan"
                >
                  <X size={12} />
                </Button>
              </div>
            )}

            <Input
              id="gambar"
              name="gambar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0 w-full"
            />
            {errors.gambar && <p className="text-red-500 text-sm mt-1">{errors.gambar[0]}</p>}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, is_active: Boolean(checked) }))
              }
              className="data-[state=checked]:bg-[#FACC15] data-[state=checked]:border-[#FACC15] mt-0.5"
            />
            <Label htmlFor="is_active" className="text-[#374151] text-sm font-normal cursor-pointer">
              Aktifkan kampanye ini
            </Label>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold"
            >
              Perbarui
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}