// resources/js/pages/donasi/DonasiPage.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Donasi() {
  const donations = [
    {
      id: 1,
      title: 'Bantuan untuk Korban Banjir',
      description: 'Bantu saudara kita yang terdampak banjir di Jawa Timur.',
      target: 10000000,
      collected: 6500000,
      endDate: '28 Februari 2025',
    },
    {
      id: 2,
      title: 'Dana Retret Pemuda 2025',
      description: 'Biaya transportasi, konsumsi, dan materi retret.',
      target: 15000000,
      collected: 8200000,
      endDate: '10 Februari 2025',
    },
  ];

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#374151] mb-6">Donasi</h1>
          <p className="text-[#6B7280] mb-8">
            Setiap donasi yang Anda berikan akan digunakan untuk pelayanan dan kegiatan rohani.
          </p>

          <div className="space-y-6">
            {donations.map((donation) => {
              const progress = Math.min(100, Math.round((donation.collected / donation.target) * 100));
              return (
                <Link key={donation.id} to={`/donasi/${donation.id}`} className="block">
                  <Card className="hover:shadow-md transition-shadow border-0">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-[#374151]">{donation.title}</CardTitle>
                        <Heart className="text-[#FACC15]" size={20} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#6B7280] mb-4">{donation.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Rp {donation.collected.toLocaleString()}</span>
                          <span>Rp {donation.target.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FACC15] h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-[#6B7280]">
                        <Calendar size={14} className="mr-1" />
                        Berakhir: {donation.endDate}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}