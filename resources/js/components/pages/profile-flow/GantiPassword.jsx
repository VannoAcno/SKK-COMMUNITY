// resources/js/pages/profile/ChangePasswordPage.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Shield, Key } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';
import { Link, useNavigate } from 'react-router-dom';

// ✅ Skema Validasi
const emailSchema = yup.object({
  email: yup
    .string()
    .email('Email tidak valid')
    .required('Email wajib diisi'),
});

const codeSchema = yup.object({
  code: yup
    .string()
    .required('Kode wajib diisi')
    .length(6, 'Kode harus 6 digit'),
});

const passwordSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Minimal 8 karakter')
    .required('Password wajib diisi'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Password harus sama')
    .required('Konfirmasi password wajib diisi'),
});

export default function GantiPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form 1: Email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({ resolver: yupResolver(emailSchema) });

  // Form 2: Kode
  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: errorsCode },
  } = useForm({ resolver: yupResolver(codeSchema) });

  // Form 3: Password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({ resolver: yupResolver(passwordSchema) });

  // ✅ Kirim kode verifikasi
  const handleSendCode = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/password/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setEmail(data.email);
        setStep(2);
        Swal.fire({
          icon: 'success',
          title: 'Kode Terkirim!',
          text: `Kode verifikasi telah dikirim ke ${data.email}`,
          confirmButtonColor: '#FACC15',
        });
      } else {
        throw new Error(result.message || 'Pastikan email terdaftar.');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Kode',
        text: err.message,
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verifikasi kode
  const handleVerifyCode = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/password/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email }),
      });
      const result = await res.json();
      if (res.ok) {
        setCode(data.code);
        setStep(3);
        Swal.fire({
          icon: 'success',
          title: 'Kode Valid!',
          text: 'Silakan atur password baru Anda.',
          confirmButtonColor: '#FACC15',
        });
      } else {
        throw new Error(result.message || 'Kode tidak valid atau kadaluarsa.');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Kode Tidak Valid',
        text: err.message,
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset password
  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, ...data }),
      });
      const result = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Password Berhasil Diubah!',
          text: 'Silakan login dengan password baru Anda.',
          confirmButtonColor: '#FACC15',
        }).then(() => {
          navigate('/login');
        });
      } else {
        throw new Error(result.message || 'Gagal mengubah password.');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengubah Password',
        text: err.message,
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              {step === 1 && <Mail className="w-8 h-8 text-[#FACC15]" />}
              {step === 2 && <Shield className="w-8 h-8 text-[#FACC15]" />}
              {step === 3 && <Key className="w-8 h-8 text-[#FACC15]" />}
            </div>
            <CardTitle className="text-2xl font-bold text-[#374151]">
              {step === 1 && 'Lupa Password?'}
              {step === 2 && 'Verifikasi Kode'}
              {step === 3 && 'Atur Password Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={handleSubmitEmail(handleSendCode)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[#374151]">Email Terdaftar</label>
                  <Input
                    type="email"
                    placeholder="nama@sekolah.sch.id"
                    {...registerEmail('email')}
                    className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${errorsEmail.email ? 'border-red-500' : ''}`}
                  />
                  {errorsEmail.email && (
                    <p className="text-red-500 text-sm">{errorsEmail.email.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold py-6"
                >
                  {loading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
                </Button>
                <div className="text-center">
                  <Link to="/login" className="text-[#FACC15] hover:underline text-sm">
                    Kembali ke Login
                  </Link>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitCode(handleVerifyCode)} className="space-y-5">
                <p className="text-[#6B7280] text-sm text-center">
                  Kode 6 digit telah dikirim ke <br />
                  <span className="font-medium text-[#374151]">{email}</span>
                </p>
                <div className="space-y-2">
                  <label className="text-[#374151]">Kode Verifikasi</label>
                  <Input
                    type="text"
                    placeholder="123456"
                    {...registerCode('code')}
                    className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${errorsCode.code ? 'border-red-500' : ''}`}
                  />
                  {errorsCode.code && (
                    <p className="text-red-500 text-sm">{errorsCode.code.message}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    {loading ? 'Memverifikasi...' : 'Verifikasi'}
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmitPassword(handleResetPassword)} className="space-y-5">
                {/* Password Baru */}
                <div className="space-y-2">
                  <label className="text-[#374151]">Password Baru</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimal 8 karakter"
                      {...registerPassword('password')}
                      className={`pl-3 pr-10 border-[#FDE68A] focus-visible:ring-[#FACC15] ${errorsPassword.password ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {errorsPassword.password && (
                    <p className="text-red-500 text-sm">{errorsPassword.password.message}</p>
                  )}
                </div>

                {/* Konfirmasi Password */}
                <div className="space-y-2">
                  <label className="text-[#374151]">Konfirmasi Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Masukkan ulang password"
                      {...registerPassword('password_confirmation')}
                      className={`pl-3 pr-10 border-[#FDE68A] focus-visible:ring-[#FACC15] ${errorsPassword.password_confirmation ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {errorsPassword.password_confirmation && (
                    <p className="text-red-500 text-sm">{errorsPassword.password_confirmation.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold py-6"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}