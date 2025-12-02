// src/pages/register/SignUp1.jsx
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
import { Link, useNavigate } from 'react-router-dom'; // 👈 Tambahkan useNavigate

export default function SignUp1() {
    const navigate = useNavigate(); // 👈 Tambahkan ini

    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        birthDate: '',
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
        if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi.';
        if (!formData.gender) newErrors.gender = 'Pilih jenis kelamin.';
        if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi.';
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
        localStorage.setItem('registerStep1', JSON.stringify(formData));

        console.log('Data Step 1:', formData);
        navigate('/register/step-2');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 shadow-xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center">
                            <span className="text-2xl">1</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#374151]">Informasi Pribadi</CardTitle>
                    <p className="text-sm text-[#6B7280] mt-2">
                        Langkah 1 dari 5
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Lengkap */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-[#374151]">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.fullName ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="space-y-2">
                            <Label className="text-[#374151]">
                                Jenis Kelamin <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => handleChange('gender', value)}
                            >
                                <SelectTrigger
                                    className={`border-[#FDE68A] focus:ring-[#FACC15] ${errors.gender ? 'border-red-500' : ''
                                        }`}
                                >
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">Laki-laki</SelectItem>
                                    <SelectItem value="P">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && (
                                <p className="text-red-500 text-sm">{errors.gender}</p>
                            )}
                        </div>

                        {/* Tanggal Lahir */}
                        <div className="space-y-2">
                            <Label htmlFor="birthDate" className="text-[#374151]">
                                Tanggal Lahir <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => handleChange('birthDate', e.target.value)}
                                className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.birthDate ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.birthDate && (
                                <p className="text-red-500 text-sm">{errors.birthDate}</p>
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
                                <Link to="/register">Kembali</Link>
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