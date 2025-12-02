// resources/js/pages/profil/ProfilPage.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, School, Calendar, Mail, Phone, MapPin, Edit, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Profil() {
  // TODO: Ambil dari API atau context
  const user = {
    fullName: 'Budi Santoso',
    gender: 'Laki-laki',
    birthDate: '15 Mei 2007',
    school: 'SMAK 1 PENABUR Surabaya',
    grade: 'XI',
    major: 'IPA',
    email: 'budi.santoso@smak1.sch.id',
    phone: '0812-3456-7890',
    address: 'Jl. Contoh No. 123, Surabaya',
  };

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#374151]">Profil Saya</h1>
            <Button
              variant="outline"
              asChild
              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
            >
              <Link to="/profil/edit">
                <Edit size={16} className="mr-1" />
                Edit Profil
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Pribadi */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#374151]">
                  <User size={18} />
                  Data Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-[#6B7280]">Nama Lengkap</div>
                  <div className="font-medium">{user.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-[#6B7280]">Jenis Kelamin</div>
                  <div className="font-medium">{user.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-[#6B7280]">Tanggal Lahir</div>
                  <div className="font-medium">{user.birthDate}</div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sekolah */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#374151]">
                  <School size={18} />
                  Data Sekolah
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-[#6B7280]">Sekolah</div>
                  <div className="font-medium">{user.school}</div>
                </div>
                <div>
                  <div className="text-sm text-[#6B7280]">Kelas</div>
                  <div className="font-medium">Kelas {user.grade}</div>
                </div>
                <div>
                  <div className="text-sm text-[#6B7280]">Jurusan</div>
                  <div className="font-medium">{user.major}</div>
                </div>
              </CardContent>
            </Card>

            {/* Kontak */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#374151]">
                  <Mail size={18} />
                  Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-[#6B7280]">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-[#6B7280]">Nomor HP</div>
                  <div className="font-medium">{user.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-[#6B7280]">Alamat</div>
                  <div className="font-medium">{user.address}</div>
                </div>
              </CardContent>
            </Card>

            {/* Aksi Akun */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#374151]">
                  <Key size={18} />
                  Keamanan Akun
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                >
                  <Link to="/profil/ganti-password">
                    <Key size={16} className="mr-2" />
                    Ganti Password
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}