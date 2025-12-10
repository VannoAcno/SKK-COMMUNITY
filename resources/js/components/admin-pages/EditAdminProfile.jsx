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
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Mail, Phone, MapPin, User, School } from 'lucide-react';
import { Check, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/shared/Footer';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=SKK&background=FACC15&color=ffffff&size=128';

export default function EditAdminProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    birth_date: '',
    school: '',
    grade: '',
    major: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [openSchool, setOpenSchool] = useState(false);
  const [openMajor, setOpenMajor] = useState(false);

  const schools = [
    'SMAK 1 PENABUR Surabaya',
    'SMAK 2 PENABUR Surabaya',
    'SMUK PENABUR 1 Surabaya',
    'SMUK PENABUR 2 Surabaya',
    'SMKK PENABUR Surabaya',
    'SMAK BPK PENABUR Surabaya',
    'SMAK SANTO ANDREAS Surabaya',
    'SMAK SANTO LOUIS 1 Surabaya',
    'SMAK SANTO LOUIS 2 Surabaya',
    'SMAK SANTO YOSEF Surabaya',
    'SMAK SANTO PAULUS Surabaya',
    'SMAK SANTO PETRUS Surabaya',
    'SMAK SANTO THOMAS Surabaya',
    'SMAK KRISTEN KARUNIA Surabaya',
    'SMAK KRISTEN SAINT JOHN Surabaya',
    'SMAK KRISTEN YAKOBUS Surabaya',
    'SMAK KRISTEN SANTO KRISANTUS Surabaya',
    'SMAK KRISTEN IMMANUEL Surabaya',
    'SMAK KRISTEN GIDEON Surabaya',
    'SMAK KRISTEN SURABAYA',
    'SMAK KRISTEN MUKTI Surabaya',
    'SMK KRISTEN KARUNIA Surabaya',
    'SMK KRISTEN SAINT JOHN Surabaya',
    'SMK KRISTEN YAKOBUS Surabaya',
    'SMA NEGERI 1 SURABAYA',
    'SMA NEGERI 2 SURABAYA',
    'SMA NEGERI 3 SURABAYA',
    'SMA NEGERI 4 SURABAYA',
    'SMA NEGERI 5 SURABAYA',
    'SMA NEGERI 6 SURABAYA',
    'SMA NEGERI 7 SURABAYA',
    'SMA NEGERI 8 SURABAYA',
    'SMA NEGERI 9 SURABAYA',
    'SMA NEGERI 10 SURABAYA',
    'SMA NEGERI 11 SURABAYA',
    'SMA NEGERI 12 SURABAYA',
    'SMA NEGERI 13 SURABAYA',
    'SMA NEGERI 14 SURABAYA',
    'SMA NEGERI 15 SURABAYA',
    'SMA NEGERI 16 SURABAYA',
    'SMA NEGERI 17 SURABAYA',
    'SMA NEGERI 18 SURABAYA',
    'SMA NEGERI 19 SURABAYA',
    'SMA NEGERI 20 SURABAYA',
    'SMK NEGERI 1 SURABAYA',
    'SMK NEGERI 2 SURABAYA',
    'SMK NEGERI 3 SURABAYA',
    'SMK NEGERI 4 SURABAYA',
    'SMK NEGERI 5 SURABAYA',
    'SMK NEGERI 6 SURABAYA',
    'SMK NEGERI 7 SURABAYA',
    'SMK NEGERI 8 SURABAYA',
    'SMK NEGERI 9 SURABAYA',
    'SMK NEGERI 10 SURABAYA',
    'SMK NEGERI 11 SURABAYA',
    'SMK NEGERI 12 SURABAYA',
  ];

  const grades = ['X', 'XI', 'XII'];
  const majorsByGrade = {
    X: [
      'Belum memilih jurusan',
      'IPA (Ilmu Pengetahuan Alam)',
      'IPS (Ilmu Pengetahuan Sosial)',
      'Bahasa dan Sastra',
      'Peminatan Ilmu Keagamaan',
      'Teknik Komputer dan Jaringan',
      'Rekayasa Perangkat Lunak',
      'Teknik Elektronika',
      'Teknik Otomotif',
      'Akuntansi',
      'Administrasi Perkantoran',
      'Pemasaran',
      'Tata Boga',
      'Tata Busana',
      'Desain Komunikasi Visual',
      'Perhotelan',
      'Farmasi',
      'Keperawatan',
    ],
    XI: [
      'IPA (Ilmu Pengetahuan Alam)',
      'IPS (Ilmu Pengetahuan Sosial)',
      'Bahasa dan Sastra',
      'Peminatan Ilmu Keagamaan',
      'Teknik Komputer dan Jaringan',
      'Rekayasa Perangkat Lunak',
      'Teknik Elektronika',
      'Teknik Otomotif',
      'Akuntansi',
      'Administrasi Perkantoran',
      'Pemasaran',
      'Tata Boga',
      'Tata Busana',
      'Desain Komunikasi Visual',
      'Perhotelan',
      'Farmasi',
      'Keperawatan',
      'Multimedia',
      'Teknik Sipil',
      'Teknik Mesin',
      'Agribisnis',
      'Agroteknologi',
    ],
    XII: [
      'IPA (Ilmu Pengetahuan Alam)',
      'IPS (Ilmu Pengetahuan Sosial)',
      'Bahasa dan Sastra',
      'Peminatan Ilmu Keagamaan',
      'Teknik Komputer dan Jaringan',
      'Rekayasa Perangkat Lunak',
      'Teknik Elektronika',
      'Teknik Otomotif',
      'Akuntansi',
      'Administrasi Perkantoran',
      'Pemasaran',
      'Tata Boga',
      'Tata Busana',
      'Desain Komunikasi Visual',
      'Perhotelan',
      'Farmasi',
      'Keperawatan',
      'Multimedia',
      'Teknik Sipil',
      'Teknik Mesin',
      'Agribisnis',
      'Agroteknologi',
    ],
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      // Helper: konversi ISO date ke YYYY-MM-DD
      const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      };

      // Validasi nilai yang ada di daftar
      const validSchool = schools.includes(userData.school) ? userData.school : '';
      const validGrade = grades.includes(userData.grade) ? userData.grade : '';
      const validMajor =
        validGrade && majorsByGrade[validGrade]?.includes(userData.major)
          ? userData.major
          : '';

      setFormData({
        full_name: userData.full_name || '',
        gender: userData.gender || '',
        birth_date: formatDate(userData.birth_date) || '',
        school: validSchool,
        grade: validGrade,
        major: validMajor,
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
      setAvatarPreview((userData.avatar || DEFAULT_AVATAR).trim());
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Nama lengkap wajib diisi.';
    if (!formData.gender) newErrors.gender = 'Pilih jenis kelamin.';
    if (!formData.birth_date) newErrors.birth_date = 'Tanggal lahir wajib diisi.';
    if (!formData.school) newErrors.school = 'Pilih sekolah Anda.';
    if (!formData.grade) newErrors.grade = 'Pilih kelas Anda.';
    if (!formData.email) newErrors.email = 'Email wajib diisi.';
    if (!formData.phone) newErrors.phone = 'Nomor HP wajib diisi.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const apiData = new FormData();
      apiData.append('full_name', formData.full_name);
      apiData.append('gender', formData.gender);
      apiData.append('birth_date', formData.birth_date);
      apiData.append('school', formData.school);
      apiData.append('grade', formData.grade);
      if (formData.major) apiData.append('major', formData.major);
      apiData.append('email', formData.email);
      apiData.append('phone', formData.phone);
      if (formData.address) apiData.append('address', formData.address);
      if (avatarFile) {
        apiData.append('avatar', avatarFile);
      }

      const token = localStorage.getItem('auth_token');

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: apiData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal memperbarui profil');

      localStorage.setItem('user', JSON.stringify(result.user));
      alert('Profile berhasil diperbarui!');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-[#374151]">Edit Profile</CardTitle>
              <p className="text-[#6B7280]">Perbarui informasi akun Anda.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Foto Profil */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-[#FACC15] flex items-center justify-center border-4 border-white shadow-lg mb-4">
                    <img
                      src={avatarPreview}
                      alt="Profile Photo"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                  <Label className="cursor-pointer text-[#FACC15] hover:underline flex items-center gap-1">
                    <User size={16} />
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </Label>
                </div>

                {/* Data Pribadi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-[#374151]">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className={`pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.full_name ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#374151]">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      key={formData.gender}
                      value={formData.gender}
                      onValueChange={(value) => handleChange('gender', value)}
                    >
                      <SelectTrigger
                        className={`border-[#FDE68A] focus:ring-[#FACC15] ${errors.gender ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_date" className="text-[#374151]">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                      <Input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => handleChange('birth_date', e.target.value)}
                        className={`pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.birth_date ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.birth_date && <p className="text-red-500 text-sm">{errors.birth_date}</p>}
                  </div>
                </div>

                {/* Data Sekolah */}
                <div className="border-t border-[#FDE68A] pt-6">
                  <h3 className="text-lg font-bold text-[#374151] mb-4">Data Sekolah</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#374151]">
                        Sekolah <span className="text-red-500">*</span>
                      </Label>
                      <Popover
                        key={formData.school}
                        open={openSchool}
                        onOpenChange={setOpenSchool}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSchool}
                            className={`w-full justify-between text-left border-[#FDE68A] ${errors.school ? 'border-red-500' : ''}`}
                          >
                            {formData.school || 'Pilih sekolah Anda'}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0 max-h-[300px] overflow-y-auto bg-white shadow-lg rounded-md"
                          align="start"
                          side="bottom"
                          sideOffset={8}
                        >
                          <Command>
                            <CommandInput placeholder="Cari sekolah..." />
                            <CommandList>
                              <CommandEmpty>Sekolah tidak ditemukan.</CommandEmpty>
                              <CommandGroup>
                                {schools.map((school) => (
                                  <CommandItem
                                    key={school}
                                    value={school}
                                    onSelect={(currentValue) => {
                                      handleChange('school', currentValue === formData.school ? '' : currentValue);
                                      setOpenSchool(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${formData.school === school ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    {school}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#374151]">
                        Kelas <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        key={formData.grade}
                        value={formData.grade}
                        onValueChange={(value) => {
                          handleChange('grade', value);
                          handleChange('major', '');
                        }}
                      >
                        <SelectTrigger
                          className={`border-[#FDE68A] focus:ring-[#FACC15] ${errors.grade ? 'border-red-500' : ''}`}
                        >
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              Kelas {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#374151]">Jurusan</Label>
                      {formData.grade && majorsByGrade[formData.grade] ? (
                        <Popover
                          key={`${formData.grade}-${formData.major}`}
                          open={openMajor}
                          onOpenChange={setOpenMajor}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openMajor}
                              className="w-full justify-between text-left border-[#FDE68A]"
                            >
                              {formData.major || 'Pilih jurusan'}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0 max-h-[300px] overflow-y-auto bg-white shadow-lg rounded-md"
                            align="start"
                            side="bottom"
                            sideOffset={8}
                          >
                            <Command>
                              <CommandInput placeholder="Cari jurusan..." />
                              <CommandList>
                                <CommandEmpty>Jurusan tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {majorsByGrade[formData.grade].map((major) => (
                                    <CommandItem
                                      key={major}
                                      value={major}
                                      onSelect={(currentValue) => {
                                        handleChange('major', currentValue === formData.major ? '' : currentValue);
                                        setOpenMajor(false);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${formData.major === major ? 'opacity-100' : 'opacity-0'}`}
                                      />
                                      {major}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className="text-[#6B7280] text-sm italic">
                          Pilih kelas terlebih dahulu untuk memilih jurusan
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kontak */}
                <div className="border-t border-[#FDE68A] pt-6">
                  <h3 className="text-lg font-bold text-[#374151] mb-4">Kontak</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#374151]">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="nama@sekolah.sch.id"
                          className={`pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.email ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#374151]">
                        Nomor HP <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="081234567890"
                          className={`pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-[#374151]">Alamat</Label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-3 text-[#6B7280]" />
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          placeholder="Jl. Contoh No. 123, Surabaya"
                          className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/dashboard')}
                    className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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