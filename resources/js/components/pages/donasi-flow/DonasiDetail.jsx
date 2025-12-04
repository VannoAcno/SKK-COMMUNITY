// resources/js/pages/donasi/DonasiDetailPage.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Calendar, MapPin, Wallet } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

// Data dummy
const donationData = {
  1: {
    id: 1,
    title: 'Bantuan untuk Korban Banjir',
    description: 'Bantu saudara kita yang terdampak banjir di Jawa Timur. Dana akan digunakan untuk logistik, obat-obatan, dan kebutuhan pokok.',
    target: 10000000,
    collected: 6500000,
    endDate: '28 Februari 2025',
    location: 'Jawa Timur',
  },
  2: {
    id: 2,
    title: 'Dana Retret Pemuda 2025',
    description: 'Biaya transportasi, konsumsi, materi retret, dan akomodasi selama 3 hari di Villa Bukit Berbunga, Batu.',
    target: 15000000,
    collected: 8200000,
    endDate: '10 Februari 2025',
    location: 'Batu, Malang',
  },
};

export default function DonasiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const donation = donationData[id] || donationData[1];

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('dana');

  const progress = Math.min(100, Math.round((donation.collected / donation.target) * 100));

  const handleDonate = () => {
    if (!amount || isNaN(amount) || Number(amount) < 1000) {
      alert('Masukkan nominal donasi minimal Rp1.000');
      return;
    }
    alert(`Terima kasih! Anda berdonasi Rp ${Number(amount).toLocaleString()} untuk "${donation.title}"`);
    navigate('/donasi');
  };

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/donasi')}
            className="mb-6 text-[#374151] hover:bg-[#FEF9C3]"
          >
            ← Kembali ke Daftar Donasi
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Detail Campaign */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl text-[#374151]">{donation.title}</CardTitle>
                    <Heart className="text-[#FACC15]" size={24} />
                  </div>
                  <div className="flex items-center text-sm text-[#6B7280] mt-2">
                    <MapPin size={14} className="mr-1" />
                    {donation.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#6B7280] mb-6">{donation.description}</p>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Terkumpul</span>
                      <span className="font-medium">Target</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mb-1">
                      <span>Rp {donation.collected.toLocaleString()}</span>
                      <span>Rp {donation.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#FACC15] h-3 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-[#6B7280] mt-1">
                      {progress}% tercapai
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-[#6B7280]">
                    <Calendar size={14} className="mr-1" />
                    Berakhir: {donation.endDate}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Donasi */}
            <div>
              <Card className="border-0 shadow-sm sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl text-[#374151]">Donasi Sekarang</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[#374151]">Nominal Donasi</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">Rp</span>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        min="1000"
                        className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15]"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[50000, 100000, 200000].map((val) => (
                        <Button
                          key={val}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(val.toString())}
                          className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                        >
                          Rp {val.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#374151]">Metode Pembayaran</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'dana', name: 'DANA' },
                        { id: 'ovo', name: 'OVO' },
                        { id: 'gopay', name: 'GoPay' },
                        { id: 'transfer', name: 'Transfer' },
                      ].map((method) => (
                        <Button
                          key={method.id}
                          type="button"
                          variant={paymentMethod === method.id ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`${
                            paymentMethod === method.id
                              ? 'bg-[#FACC15] text-black hover:bg-[#EAB308]'
                              : 'border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]'
                          }`}
                        >
                          <Wallet size={14} className="mr-1" />
                          {method.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleDonate}
                    className="w-full bg-[#FACC15] text-black hover:bg-[#EAB308] text-lg py-6 mt-4"
                  >
                    Donasi Sekarang
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}