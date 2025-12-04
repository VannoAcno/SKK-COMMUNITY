// resources/js/pages/register/SignUp4.jsx
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
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp4() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Password tidak cocok.';
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

    // Simpan data ke localStorage
    localStorage.setItem('registerStep4', JSON.stringify(formData));
    
    console.log('Password disetel.');
    navigate('/register/step-5');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center">
              <span className="text-2xl">4</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#374151]">Buat Akun Anda</CardTitle>
          <p className="text-sm text-[#6B7280] mt-2">
            Langkah 4 dari 5
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#374151]">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Buat password Anda"
                  className={`border-[#FDE68A] focus-visible:ring-[#FACC15] pr-10 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
              <p className="text-xs text-[#6B7280] mt-1">
                Minimal 8 karakter (boleh huruf, angka, atau simbol).
              </p>
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#374151]">
                Konfirmasi Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`border-[#FDE68A] focus-visible:ring-[#FACC15] pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                asChild
                className="flex-1 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
              >
                <Link to="/register/step-3">Kembali</Link>
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