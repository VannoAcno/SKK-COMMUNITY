// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

// ✅ API Base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Kirim ke API Laravel
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Email atau password salah');
      }

      // ✅ Simpan token & user ke localStorage
      localStorage.setItem('auth_token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // ✅ Redirect ke halaman utama
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      alert('Login gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center">
              <span className="text-2xl">🙏</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#374151]">Masuk ke SKK Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                required
                className="border-[#FDE68A] focus-visible:ring-[#FACC15]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#374151]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-[#FACC15] hover:underline"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#FDE68A] focus-visible:ring-[#FACC15] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold py-6 text-lg"
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </Button>

            <div className="text-center text-sm text-[#6B7280]">
              Belum punya akun?{' '}
              <Link to="/register" className="text-[#FACC15] font-medium hover:underline">
                Daftar Sekarang
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}