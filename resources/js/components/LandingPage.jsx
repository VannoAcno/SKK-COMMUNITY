// resources/js/pages/LandingPage.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import NavbarBefore from './shared/NavbarBefore';
import Footer from './shared/Footer';
import { Heart, Calendar } from 'lucide-react';

// ✅ Data renungan dummy (nanti diganti dari API)
const renunganDummy = {
  tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  ayat: 'Yeremia 29:11',
  teks: 'Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.',
  refleksi: 'Tuhan memiliki rencana indah untuk hidup kita. Walaupun saat ini kita menghadapi tantangan, kita bisa tenang karena Ia selalu menyertai kita.',
  kategori: 'Harapan',
};

export default function LandingPage() {
  const schools = [
    'SMAK 1 PENABUR Surabaya',
    'SMAK KARUNIA Surabaya',
    'SMAK SANTO YOSEF',
    'SMUK PENABUR 2',
    'SMAK SANTO PAULUS',
  ];

  const activities = [
    { id: 1, title: 'Retret Pemuda 2025', date: '15–17 Februari 2025' },
    { id: 2, title: 'Bakti Sosial SKK', date: '22 Maret 2025' },
    { id: 3, title: 'Kebaktian Bersama Lintas Sekolah', date: '5 April 2025' },
  ];

  return (
    <>
      <NavbarBefore />
      <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
        {/* Hero Section — Lebih Minimalis & Clean */}
        <section className="relative bg-gradient-to-br from-[#FDE68A] to-[#FACC15] text-black pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-black text-[#FACC15] px-5 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span>✨</span>
                Komunitas Siswa Kristen Surabaya
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Bersatu dalam <span className="text-black">Kasih Kristus</span>
              </h1>
              <p className="text-lg md:text-xl text-[#374151] max-w-2xl mx-auto mb-10 leading-relaxed">
                Wadah digital untuk siswa Kristen lintas sekolah bersekutu, melayani, dan bertumbuh bersama.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Link to="/register">
                  <Button
                    className="bg-white text-black hover:bg-gray-50 border border-gray-200 text-lg px-9 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    👥 Daftar Anggota
                  </Button>
                </Link>
                <Link to="/donasi">
                  <Button
                    className="bg-white text-black hover:bg-gray-50 border border-gray-200 text-lg px-9 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    💛 Berikan Donasi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Fitur Utama — Flat & Clean */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#374151] mb-4">
              Platform untuk Generasi Muda Kristen
            </h2>
            <p className="text-center text-[#6B7280] max-w-2xl mx-auto mb-16">
              Bangun persaudaraan, layani sesama, dan bertumbuh dalam iman — semua dalam satu platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: '👥', title: 'Persekutuan', desc: 'Bangun relasi lintas sekolah' },
                { icon: '🙌', title: 'Pelayanan', desc: 'Layani sesama lewat kegiatan nyata' },
                { icon: '📖', title: 'Firman Tuhan', desc: 'Renungan & khotbah harian' },
                { icon: '🤝', title: 'Donasi', desc: 'Dukung pelayanan dengan berbagi' },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="bg-[#FEF9C3] hover:bg-[#FFFBE6] border border-[#FDE68A] rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-[#374151] text-lg mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sekolah & Kegiatan — Lebih Visual */}
        <section className="py-24 bg-[#FEF9C3]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Sekolah */}
              <div>
                <h2 className="text-3xl font-bold text-[#374151] mb-6">Sekolah-Sekolah Anggota</h2>
                <p className="text-[#6B7280] mb-8">
                  Lebih dari 15 sekolah Kristen di Surabaya telah bergabung dalam komunitas ini.
                </p>
                <div className="flex flex-wrap gap-3">
                  {schools.map((school, i) => (
                    <span
                      key={i}
                      className="bg-white px-4 py-2 rounded-full text-[#374151] text-sm font-medium border border-[#FDE68A] shadow-sm"
                    >
                      {school}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kegiatan */}
              <div>
                <h2 className="text-3xl font-bold text-[#374151] mb-6">Kegiatan Terbaru</h2>
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-white p-4 rounded-xl border-l-4 border-[#FACC15] shadow-sm"
                    >
                      <div className="font-bold text-[#374151]">{act.title}</div>
                      <div className="text-[#6B7280] text-sm">{act.date}</div>
                    </div>
                  ))}
                </div>
                <Link to="/kegiatan" className="inline-block mt-6 text-[#FACC15] font-semibold hover:underline">
                  Lihat semua kegiatan →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ RENUNGAN HARIAN — di bawah kegiatan */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#374151] mb-8">Renungan Harian</h2>
            <div className="max-w-3xl mx-auto">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center flex-shrink-0">
                      <Heart size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-sm text-[#6B7280]">
                        <Calendar size={16} />
                        {renunganDummy.tanggal}
                      </div>
                      <h3 className="font-bold text-lg text-[#374151]">{renunganDummy.ayat}</h3>
                      <p className="text-[#374151] mt-2 italic">"{renunganDummy.teks}"</p>
                      <p className="text-[#6B7280] mt-3">{renunganDummy.refleksi}</p>
                      <div className="mt-3">
                        <span className="inline-block bg-[#FEF9C3] text-[#374151] text-xs px-2 py-1 rounded-full">
                          #{renunganDummy.kategori}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final — Sesuai Screenshot */}
        <section className="py-20 bg-[#FACC15] text-white text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Jadilah Bagian dari Gerakan Ini
              </h2>
              <p className="mb-8 opacity-90">
                Setiap donasi, doa, dan partisipasimu membawa damai sejahtera bagi banyak orang.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/donasi">
                  <Button
                    className="bg-white text-black hover:bg-gray-50 border border-gray-200 font-bold px-8 py-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <span>💛</span> Berikan Donasi
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className="bg-white text-black hover:bg-gray-50 border border-gray-200 font-bold px-8 py-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <span>👥</span> Daftar Anggota
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}