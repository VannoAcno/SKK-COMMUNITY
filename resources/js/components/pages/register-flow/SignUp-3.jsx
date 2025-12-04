// resources/js/pages/register/SignUp3.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp3() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    const phoneRegex = /^[\d\s()+-]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor HP wajib diisi.';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Nomor HP minimal 10 digit.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Nomor HP hanya boleh angka dan simbol (+, -, (), spasi).';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ SIMPAN KE LOCAL STORAGE
    localStorage.setItem('registerStep3', JSON.stringify(formData));

    console.log('Data Step 3:', formData);
    navigate('/register/step-4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center">
              <span className="text-2xl">3</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#374151]">Kontak & Alamat</CardTitle>
          <p className="text-sm text-[#6B7280] mt-2">
            Langkah 3 dari 5
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#374151]">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Nomor HP */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#374151]">
                Nomor HP <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Contoh: 081234567890"
                className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Alamat (Opsional) */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#374151]">
                Alamat Lengkap
              </Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Jl. Contoh No. 123, Surabaya"
                className="border-[#FDE68A] focus-visible:ring-[#FACC15]"
              />
              <p className="text-xs text-[#6B7280]">
                Digunakan untuk keperluan kegiatan offline (opsional).
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                asChild
                className="flex-1 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
              >
                <Link to="/register/step-2">Kembali</Link>
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
              >
                Lanjut
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}