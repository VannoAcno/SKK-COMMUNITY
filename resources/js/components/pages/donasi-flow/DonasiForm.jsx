// resources/js/pages/DonasiForm.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCode, Upload, CheckCircle } from 'lucide-react';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

// ✅ Import gambar sebagai variabel
import SKKQR from '@/assets/SKKQRIS.webp'; // Pastikan path ini benar

export default function DonasiForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nominal: '',
    pesan: '',
    bukti_transfer: null,
    kampanye_id: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      setUser(userData);
      setFormData(prev => ({ ...prev, nama: userData.full_name, email: userData.email }));
    }

    if (location.state?.kampanyeId) {
      setFormData(prev => ({ ...prev, kampanye_id: location.state.kampanyeId }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, bukti_transfer: e.target.files[0] }));
    if (formErrors.bukti_transfer) {
      setFormErrors(prev => ({ ...prev, bukti_transfer: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!formData.kampanye_id) {
       alert("Silakan pilih kampanye donasi terlebih dahulu.");
       return;
    }

    const token = localStorage.getItem('auth_token');
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });

    setLoading(true);

    try {
      const res = await fetch('/api/donasi', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formDataToSend,
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setFormErrors(result.errors);
        }
        throw new Error(result.message || 'Gagal mengirim donasi.');
      }

      setFormData({ nama: '', email: '', nominal: '', pesan: '', bukti_transfer: null, kampanye_id: null });
      setIsSubmitted(true);

    } catch (err) {
      console.error('Gagal mengirim donasi:', err);
      alert(`Gagal mengirim donasi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <NavbarAfter user={user} />
        <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FACC15]/10 py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-[#374151] mb-2">Terima Kasih!</h2>
                <p className="text-[#6B7280] mb-6">
                  Donasi Anda sedang kami proses. Kami akan segera memverifikasinya.
                </p>
                <Button onClick={() => { setIsSubmitted(false); navigate('/donasi'); }}>Kembali ke Daftar Kampanye</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarAfter user={user} />
      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FACC15]/10 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-[#374151] font-bold text-center">Konfirmasi Donasi untuk "{location.state?.kampanyeJudul || 'Kampanye Umum'}"</CardTitle>
              <p className="text-center text-[#6B7280]">
                Ikuti petunjuk di bawah ini untuk menyelesaikan donasi Anda.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* QR Code Section */}
                <div className="bg-[#FEF9C3]/30 p-6 rounded-lg border border-[#FDE68A]">
                  <h3 className="font-bold text-lg text-[#374151] mb-4 flex items-center gap-2">
                    <QrCode size={20} /> Scan QR Code GoPay
                  </h3>
                  <p className="text-[#6B7280] text-sm mb-4">
                    Silakan scan QR Code di bawah ini untuk mentransfer donasi Anda sesuai nominal yang Anda inginkan.
                  </p>
                  {/* ✅ Gunakan variabel import gambar */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-md border border-[#FACC15]">
                      <img
                        src={SKKQR} // 🔹 Gunakan variabel yang di-import
                        alt="QR Code Donasi GoPay"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-[#6B7280] text-xs mt-2 text-center">
                    QR Code untuk merchant GoPay Anda
                  </p>
                </div>

                {/* Form Donasi Section */}
                <div>
                  <h3 className="font-bold text-lg text-[#374151] mb-4">Form Konfirmasi Donasi</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nama">Nama Lengkap *</Label>
                      <Input
                        id="nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required
                        className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
                      />
                      {formErrors.nama && <p className="text-red-500 text-sm mt-1">{formErrors.nama[0]}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
                      />
                      {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email[0]}</p>}
                    </div>
                    <div>
                      <Label htmlFor="nominal">Nominal Donasi (Rp) *</Label>
                      <Input
                        id="nominal"
                        name="nominal"
                        type="number"
                        value={formData.nominal}
                        onChange={handleInputChange}
                        required
                        min="1000"
                        placeholder="Contoh: 50000"
                        className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
                      />
                      {formErrors.nominal && <p className="text-red-500 text-sm mt-1">{formErrors.nominal[0]}</p>}
                    </div>
                    <div>
                      <Label htmlFor="pesan">Pesan Ucapan (Opsional)</Label>
                      <Textarea
                        id="pesan"
                        name="pesan"
                        value={formData.pesan}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Tulis pesan atau doa singkat..."
                        className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
                      />
                      {formErrors.pesan && <p className="text-red-500 text-sm mt-1">{formErrors.pesan[0]}</p>}
                    </div>
                    <div>
                      <Label htmlFor="bukti_transfer">Upload Bukti Transfer *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bukti_transfer"
                          name="bukti_transfer"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0"
                        />
                        <Upload size={18} className="text-[#6B7280]" />
                      </div>
                      {formErrors.bukti_transfer && <p className="text-red-500 text-sm mt-1">{formErrors.bukti_transfer[0]}</p>}
                    </div>
                    {/* Hidden input untuk kampanye_id */}
                    <input type="hidden" name="kampanye_id" value={formData.kampanye_id || ''} />
                    <Button type="submit" disabled={loading} className="w-full bg-[#FACC15] hover:bg-[#e0b70a] text-black">
                      {loading ? 'Mengirim...' : 'Kirim Konfirmasi Donasi'}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}