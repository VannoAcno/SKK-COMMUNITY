// src/pages/RegisterPage.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#374151]">Gabung ke SKK Community</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-[#6B7280] mb-6">
            Pendaftaran berlangsung dalam beberapa langkah sederhana.
          </p>

          <div className="space-y-4">
            {[
              { step: 1, title: 'Informasi Pribadi', desc: 'Nama, tanggal lahir, jenis kelamin' },
              { step: 2, title: 'Data Sekolah', desc: 'Nama sekolah, kelas, jurusan' },
              { step: 3, title: 'Kontak & Alamat', desc: 'Email, nomor HP, alamat rumah' },
              { step: 4, title: 'Akun', desc: 'Buat password dan verifikasi email' },
              { step: 5, title: 'Konfirmasi', desc: 'Review data dan selesaikan' },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#FDE68A]"
              >
                <div className="w-7 h-7 rounded-full bg-[#FACC15] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-[#374151]">{item.title}</div>
                  <div className="text-sm text-[#6B7280]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Button
            asChild
            className="w-full mt-6 bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold py-6 text-lg"
          >
            <Link to="/register/step-1">Mulai Pendaftaran</Link>
          </Button>

          <div className="text-center text-sm text-[#6B7280] mt-4">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#FACC15] font-medium hover:underline">
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}