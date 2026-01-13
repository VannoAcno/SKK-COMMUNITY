// resources/js/pages/admin/EditRenungan.jsx
import React, { useState, useEffect } from 'react';
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
import { Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function EditRenungan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    tanggal: '',
    kategori: 'Pagi',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRenungan = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/admin/renungans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        setFormData({
          judul: data.judul || '',
          isi: data.isi || '',
          tanggal: data.tanggal ? data.tanggal.split('T')[0] : '',
          kategori: data.kategori || 'Pagi',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Tidak dapat memuat data renungan.',
          confirmButtonColor: '#FACC15',
        });
        navigate('/admin/renungans');
      }
    };
    fetchRenungan();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.judul?.trim()) newErrors.judul = ['Judul wajib diisi.'];
    if (!formData.isi?.trim()) newErrors.isi = ['Isi renungan wajib diisi.'];
    if (!formData.tanggal) newErrors.tanggal = ['Tanggal wajib diisi.'];
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
      apiData.append('_method', 'PUT');
      apiData.append('judul', formData.judul);
      apiData.append('isi', formData.isi);
      apiData.append('tanggal', formData.tanggal);
      apiData.append('kategori', formData.kategori);

      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/renungans/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: apiData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 422 && result.errors) {
          setErrors(result.errors);
        } else {
          throw new Error(result.message || 'Gagal memperbarui renungan');
        }
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Renungan berhasil diperbarui.',
        confirmButtonColor: '#FACC15',
      });
      navigate('/admin/renungans');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat memperbarui renungan.',
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
                <CardTitle className="text-2xl text-[#374151]">Edit Renungan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="judul" className="text-[#374151]">
                        Judul Ayat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="judul"
                        value={formData.judul}
                        onChange={(e) => handleChange('judul', e.target.value)}
                        placeholder="Contoh: Yeremia 29:11"
                        className={errors.judul ? 'border-red-500' : ''}
                      />
                      {errors.judul && <p className="text-red-500 text-sm">{errors.judul[0]}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#374151]">Kategori</Label>
                      <Select value={formData.kategori} onValueChange={(v) => handleChange('kategori', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pagi">Pagi</SelectItem>
                          <SelectItem value="Malam">Malam</SelectItem>
                          <SelectItem value="Mingguan">Mingguan</SelectItem>
                          <SelectItem value="Harapan">Harapan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tanggal" className="text-[#374151]">
                        Tanggal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => handleChange('tanggal', e.target.value)}
                        className={errors.tanggal ? 'border-red-500' : ''}
                      />
                      {errors.tanggal && <p className="text-red-500 text-sm">{errors.tanggal[0]}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="isi" className="text-[#374151]">
                        Isi Renungan <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="isi"
                        value={formData.isi}
                        onChange={(e) => handleChange('isi', e.target.value)}
                        placeholder="Tulis isi renungan..."
                        rows={6}
                        className={errors.isi ? 'border-red-500' : ''}
                      />
                      {errors.isi && <p className="text-red-500 text-sm">{errors.isi[0]}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin/renungans')}
                      className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                    >
                      {loading ? 'Memperbarui...' : 'Simpan Perubahan'}
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