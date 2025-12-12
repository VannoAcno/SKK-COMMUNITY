// resources/js/components/shared/RenunganSection.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart } from 'lucide-react';

// ✅ Data renungan dummy (nanti diganti dari API)
const renunganDummy = {
  tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  ayat: 'Yeremia 29:11',
  teks: 'Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.',
  refleksi: 'Tuhan memiliki rencana indah untuk hidup kita. Walaupun saat ini kita menghadapi tantangan, kita bisa tenang karena Ia selalu menyertai kita.',
  kategori: 'Harapan',
};

export default function Renungan() {
  const [renungan, setRenungan] = useState(renunganDummy);

  // ✅ Ambil renungan dari API (nanti)
  useEffect(() => {
    // Contoh:
    // fetch('/api/renungan/harian').then(res => res.json()).then(setRenungan);
  }, []);

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-[#FACC15]/20 to-[#FDE68A]/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center flex-shrink-0">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">{renungan.tanggal}</span>
            </div>
            <h3 className="font-bold text-[#374151] text-lg">{renungan.ayat}</h3>
            <p className="text-[#374151] mt-2 italic">"{renungan.teks}"</p>
            <p className="text-[#6B7280] mt-3">{renungan.refleksi}</p>
            <div className="mt-3">
              <span className="inline-block bg-[#FEF9C3] text-[#374151] text-xs px-2 py-1 rounded-full">
                #{renungan.kategori}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}