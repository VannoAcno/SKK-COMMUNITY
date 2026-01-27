// resources/js/pages/admin/TambahKampanye.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function TambahKampanye({
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
  errors = {},
}) {
  const [formData, setFormData] = useState({
    judul: initialData?.judul || '',
    deskripsi: initialData?.deskripsi || '',
    target: initialData?.target ? String(initialData.target) : '',
    gambar: null,
    is_active: initialData ? Boolean(initialData.is_active) : true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFile = (e) => {
    setFormData(prev => ({ ...prev, gambar: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {initialData ? 'Edit Kampanye Donasi' : 'Tambah Kampanye Baru'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Judul *</Label>
              <Input
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                required
                className="border-[#FDE68A]"
              />
              {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul[0]}</p>}
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows="3"
                className="border-[#FDE68A]"
              />
              {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi[0]}</p>}
            </div>

            <div>
              <Label>Target Dana (IDR)</Label>
              <Input
                name="target"
                type="number"
                value={formData.target}
                onChange={handleChange}
                placeholder="Contoh: 5000000"
                className="border-[#FDE68A]"
              />
              {errors.target && <p className="text-red-500 text-sm mt-1">{errors.target[0]}</p>}
            </div>

            <div>
              <Label>Gambar Sampul</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="border-[#FDE68A]"
              />
              {errors.gambar && <p className="text-red-500 text-sm mt-1">{errors.gambar[0]}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, is_active: checked }))
                }
                className="data-[state=checked]:bg-[#FACC15] data-[state=checked]:border-[#FACC15]"
              />
              <Label htmlFor="is_active">Aktifkan kampanye ini</Label>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" className="bg-[#FACC15] hover:bg-[#e0b70a] text-black">
              {initialData ? 'Perbarui' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}