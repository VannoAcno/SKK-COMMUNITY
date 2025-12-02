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

  const schools = [
    'SMAK 1 PENABUR Surabaya',
    'SMAK KARUNIA Surabaya',
    'SMAK SANTO YOSEF',
    'SMUK PENABUR 2',
    'SMAK SANTO PAULUS',
    'SMAK SANTO ANDREAS',
    'SMAK SANTO LOUIS 1',
    'SMAK SANTO LOUIS 2',
    'SMAK KRISTEN SAINT JOHN',
    // Tambahkan lebih banyak di sini...
  ];

  const grades = ['X', 'XI', 'XII'];
  const majorsByGrade = {
    X: ['IPA', 'IPS', 'Bahasa', 'Peminatan Ilmu Keagamaan'],
    XI: ['IPA', 'IPS', 'Bahasa', 'Peminatan Ilmu Keagamaan'],
    XII: ['IPA', 'IPS', 'Bahasa', 'Peminatan Ilmu Keagamaan'],
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
                    className={`w-full justify-between text-left border-[#FDE68A] ${
                      errors.school ? 'border-red-500' : ''
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
                              className={`mr-2 h-4 w-4 ${
                                formData.school === school ? 'opacity-100' : 'opacity-0'
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
                  className={`border-[#FDE68A] focus:ring-[#FACC15] ${
                    errors.grade ? 'border-red-500' : ''
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

            {/* Jurusan */}
            {formData.grade && (
              <div className="space-y-2">
                <Label className="text-[#374151]">Jurusan</Label>
                <Select
                  value={formData.major}
                  onValueChange={(value) => handleChange('major', value)}
                >
                  <SelectTrigger className="border-[#FDE68A] focus:ring-[#FACC15]">
                    <SelectValue placeholder="Pilih jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    {(majorsByGrade[formData.grade] || []).map((major) => (
                      <SelectItem key={major} value={major}>
                        {major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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