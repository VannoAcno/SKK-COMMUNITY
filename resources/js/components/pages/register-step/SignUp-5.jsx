// resources/js/pages/register/SignUp5.jsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function SignUp5() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Ambil data dari localStorage
    const step1 = JSON.parse(localStorage.getItem('registerStep1') || '{}');
    const step2 = JSON.parse(localStorage.getItem('registerStep2') || '{}');
    const step3 = JSON.parse(localStorage.getItem('registerStep3') || '{}');
    const step4 = JSON.parse(localStorage.getItem('registerStep4') || '{}');

    // Gabungkan semua data
    const fullData = { ...step1, ...step2, ...step3, ...step4 };
    
    // Validasi: pastikan Step 1 ada
    if (!fullData.fullName) {
      navigate('/register/step-1'); // Redirect jika data tidak lengkap
      return;
    }

    setData(fullData);
  }, [navigate]);

  const handleEdit = (step) => {
    navigate(`/register/step-${step}`);
  };

  const handleConfirm = () => {
    // TODO: Kirim data ke Laravel API
    console.log('Data lengkap untuk submit:', data);
    alert('Pendaftaran berhasil! (Demo)');

    // Hapus data localStorage setelah submit
    localStorage.removeItem('registerStep1');
    localStorage.removeItem('registerStep2');
    localStorage.removeItem('registerStep3');
    localStorage.removeItem('registerStep4');

    // Redirect ke login atau dashboard
    navigate('/login');
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center">
        <div className="text-[#374151]">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#374151]">Konfirmasi Pendaftaran</CardTitle>
          <p className="text-sm text-[#6B7280] mt-2">
            Langkah 5 dari 5 — Periksa data Anda sebelum mengirim
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Data Pribadi */}
            <div className="border border-[#FDE68A] rounded-lg p-4 bg-[#FEF9C3]/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#374151]">Informasi Pribadi</h3>
                  <p className="text-[#6B7280] text-sm mt-1">
                    {data.fullName} • {data.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {new Date(data.birthDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(1)}
                  className="text-[#FACC15] hover:bg-[#FEF9C3]"
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Data Sekolah */}
            <div className="border border-[#FDE68A] rounded-lg p-4 bg-[#FEF9C3]/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#374151]">Data Sekolah</h3>
                  <p className="text-[#6B7280] text-sm mt-1">
                    {data.school} • Kelas {data.grade} {data.major && `• ${data.major}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(2)}
                  className="text-[#FACC15] hover:bg-[#FEF9C3]"
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Kontak */}
            <div className="border border-[#FDE68A] rounded-lg p-4 bg-[#FEF9C3]/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#374151]">Kontak</h3>
                  <p className="text-[#6B7280] text-sm mt-1">
                    {data.email} • {data.phone}
                    {data.address && <><br />{data.address}</>}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(3)}
                  className="text-[#FACC15] hover:bg-[#FEF9C3]"
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Akun */}
            <div className="border border-[#FDE68A] rounded-lg p-4 bg-[#FEF9C3]/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#374151]">Akun</h3>
                  <p className="text-[#6B7280] text-sm mt-1">
                    Email: {data.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(4)}
                  className="text-[#FACC15] hover:bg-[#FEF9C3]"
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              asChild
              className="flex-1 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
            >
              <Link to="/register/step-4">Kembali</Link>
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
            >
              Selesaikan Pendaftaran
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}