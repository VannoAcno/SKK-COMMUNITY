// resources/js/pages/register/SignUp2.jsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';

export default function SignUp2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school: '',
    grade: '',
    major: '',
  });

  const [errors, setErrors] = useState({});
  const [openSchool, setOpenSchool] = useState(false);
  const [openMajor, setOpenMajor] = useState(false);

  const schools = [
    // ────────────────
    // SEKOLAH KRISTEN (SWASTA)
    // ────────────────

    // Jaringan PENABUR
    'SMAK 1 PENABUR Surabaya',
    'SMAK 2 PENABUR Surabaya',
    'SMUK PENABUR 1 Surabaya',
    'SMUK PENABUR 2 Surabaya',
    'SMKK PENABUR Surabaya',
    'SMAK BPK PENABUR Surabaya',

    // Sekolah Santo (Katolik)
    'SMAK SANTO ANDREAS Surabaya',
    'SMAK SANTO LOUIS 1 Surabaya',
    'SMAK SANTO LOUIS 2 Surabaya',
    'SMAK SANTO YOSEF Surabaya',
    'SMAK SANTO PAULUS Surabaya',
    'SMAK SANTO PETRUS Surabaya',
    'SMAK SANTO THOMAS Surabaya',

    // Sekolah Kristen Protestan
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

    // ────────────────
    // SEKOLAH NEGERI (SMA/SMK)
    // ────────────────

    // SMA Negeri Populer
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

    // SMK Negeri Populer
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
      // SMK Jurusan Umum
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
      // SMK
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
      // SMK
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (field === 'grade') {
      setFormData((prev) => ({ ...prev, grade: value, major: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.school) {
      newErrors.school = 'Pilih sekolah Anda.';
    }
    if (!formData.grade) {
      newErrors.grade = 'Pilih kelas Anda.';
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
    localStorage.setItem('registerStep2', JSON.stringify(formData));

    console.log('Data Step 2:', formData);
    navigate('/register/step-3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center">
              <span className="text-2xl">2</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#374151]">Data Sekolah</CardTitle>
          <p className="text-sm text-[#6B7280] mt-2">Langkah 2 dari 5</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Sekolah — Searchable */}
            <div className="space-y-2">
              <Label className="text-[#374151]">
                Nama Sekolah <span className="text-red-500">*</span>
              </Label>
              <Popover open={openSchool} onOpenChange={setOpenSchool}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSchool}
                    className={`w-full justify-between text-left border-[#FDE68A] ${errors.school ? 'border-red-500' : ''
                      }`}
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
                              className={`mr-2 h-4 w-4 ${formData.school === school ? 'opacity-100' : 'opacity-0'
                                }`}
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

            {/* Kelas */}
            <div className="space-y-2">
              <Label className="text-[#374151]">
                Kelas <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => handleChange('grade', value)}
              >
                <SelectTrigger
                  className={`border-[#FDE68A] focus:ring-[#FACC15] ${errors.grade ? 'border-red-500' : ''
                    }`}
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

            {/* Jurusan — Searchable */}
            {formData.grade && (
              <div className="space-y-2">
                <Label className="text-[#374151]">Jurusan</Label>
                <Popover open={openMajor} onOpenChange={setOpenMajor}>
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
                          {(majorsByGrade[formData.grade] || []).map((major) => (
                            <CommandItem
                              key={major}
                              value={major}
                              onSelect={(currentValue) => {
                                handleChange('major', currentValue === formData.major ? '' : currentValue);
                                setOpenMajor(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${formData.major === major ? 'opacity-100' : 'opacity-0'
                                  }`}
                              />
                              {major}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                asChild
                className="flex-1 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
              >
                <Link to="/register/step-1">Kembali</Link>
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