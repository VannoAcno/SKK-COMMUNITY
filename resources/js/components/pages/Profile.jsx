// resources/js/pages/profil/ProfilPage.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, School, Calendar, Mail, Phone, MapPin, Edit, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

// Gambar default jika user belum upload foto
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=SKK&background=FACC15&color=white&size=128';

export default function Profile() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const user = {
    fullName: userData.full_name || 'Nama tidak tersedia',
    gender: userData.gender === 'L' ? 'Laki-laki' : userData.gender === 'P' ? 'Perempuan' : 'Tidak diketahui',
    birthDate: userData.birth_date
      ? new Date(userData.birth_date).toLocaleDateString('id-ID')
      : 'Tanggal lahir tidak tersedia',
    school: userData.school || 'Sekolah tidak diketahui',
    grade: userData.grade || 'Kelas tidak diketahui',
    major: userData.major || 'Jurusan tidak diketahui',
    email: userData.email || 'Email tidak tersedia',
    phone: userData.phone || 'Nomor HP tidak tersedia',
    address: userData.address || 'Alamat tidak tersedia',
    avatar: userData.avatar || DEFAULT_AVATAR, // ✅ URL foto profil
  };

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* ✅ Foto Profil Bulat di Tengah Atas */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#FACC15] flex items-center justify-center border-4 border-white shadow-lg">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Foto Profil"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-[#374151] mt-4">{user.fullName}</h1>
            <p className="text-[#6B7280]">{user.school} • Kelas {user.grade}</p>
          </div>

          <div className="flex justify-end mb-6">
            <Button
              variant="outline"
              asChild
              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
            >
              <Link to="/profile/edit">
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
                  <Link to="/profile/ganti-password">
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