// resources/js/pages/TambahTopikPage.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2';

export default function TambahTopik() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    isi: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.judul.trim()) newErrors.judul = ['Judul wajib diisi.'];
    if (!formData.isi.trim()) newErrors.isi = ['Isi topik wajib diisi.'];
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
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 422 && result.errors) {
          setErrors(result.errors);
        } else {
          throw new Error(result.message || 'Gagal membuat topik');
        }
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Topik berhasil dibuat.',
        confirmButtonColor: '#FACC15',
      });
      navigate('/forum');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat membuat topik.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#374151]">Buat Topik Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="judul" className="text-[#374151]">
                    Judul Topik <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="judul"
                    value={formData.judul}
                    onChange={(e) => handleChange('judul', e.target.value)}
                    placeholder="Contoh: Apa arti iman dalam kehidupan sehari-hari?"
                    className={errors.judul ? 'border-red-500' : ''}
                  />
                  {errors.judul && <p className="text-red-500 text-sm">{errors.judul[0]}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isi" className="text-[#374151]">
                    Isi Topik <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="isi"
                    value={formData.isi}
                    onChange={(e) => handleChange('isi', e.target.value)}
                    placeholder="Tulis isi topik diskusi..."
                    rows={8}
                    className={errors.isi ? 'border-red-500' : ''}
                  />
                  {errors.isi && <p className="text-red-500 text-sm">{errors.isi[0]}</p>}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/forum')}
                    className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    {loading ? 'Membuat...' : 'Buat Topik'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}