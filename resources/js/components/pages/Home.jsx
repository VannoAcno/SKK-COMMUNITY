import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Calendar, User, Image } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '../shared/Footer';

export default function Home() {
  const navigate = useNavigate();
  const [renungan, setRenungan] = useState(null);
  const [agendas, setAgendas] = useState([]);
  const [latestAlbum, setLatestAlbum] = useState(null); // 👈 Tambah state
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const user = {
    fullName: userData.full_name || 'Anggota',
    school: userData.school || 'Sekolah tidak diketahui',
    grade: userData.grade || '-',
  };

  useEffect(() => {
    const fetchRenunganHarian = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/renungan-harian', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setRenungan(data);
      } catch (err) {
        console.error('Gagal mengambil renungan harian:', err);
        setRenungan({
          tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          judul: 'Yeremia 29:11',
          isi: 'Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu...',
          kategori: 'Harapan'
        });
      }
    };

    const fetchAgendas = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/kegiatans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        const agendasOnly = data
          .filter(k => k.tipe === 'agenda')
          .sort((a, b) => new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai))
          .slice(0, 3);
        
        setAgendas(agendasOnly);
      } catch (err) {
        console.error('Gagal mengambil agenda:', err);
        setAgendas([
          { id: 1, judul: 'Perayaan Paskah 2026', tanggal_mulai: '2026-04-05', lokasi: 'Gereja Katolik Paroki Santo Vincentius A Paulo, Widodaren Sawahan' },
          { id: 2, judul: 'Ulang Tahun Vano', tanggal_mulai: '2026-07-11', lokasi: 'Menganti Palem Pertiwi' },
          { id: 3, judul: 'Meet n Greet dengan wanita paling SETIA', tanggal_mulai: '2026-01-31', lokasi: 'Starstream' },
        ]);
      }
    };

    const fetchLatestAlbum = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/albums', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.length > 0) {
          setLatestAlbum(data[0]); // album pertama = terbaru
        }
      } catch (err) {
        console.error('Gagal mengambil album terbaru:', err);
        setLatestAlbum({
          judul: 'Retret Pemuda 2025',
          gambar_cover: 'https://via.placeholder.com/400x200?text=Retret+Pemuda+2025'
        });
      }
    };

    Promise.all([fetchRenunganHarian(), fetchAgendas(), fetchLatestAlbum()])
      .finally(() => setLoading(false));
  }, []);

  const shortcuts = [
    {
      title: 'Donasi',
      description: 'Dukung pelayanan SKK',
      icon: Heart,
      color: 'text-[#FACC15]',
      bg: 'bg-[#FEF9C3]',
      link: '/donasi',
    },
    {
      title: 'Forum Diskusi',
      description: 'Diskusi dengan anggota lain',
      icon: MessageCircle,
      color: 'text-[#3B82F6]',
      bg: 'bg-blue-50',
      link: '/forum',
    },
    {
      title: 'Kegiatan',
      description: 'Lihat agenda & laporan',
      icon: Calendar,
      color: 'text-[#10B981]',
      bg: 'bg-green-50',
      link: '/kegiatan',
    },
    {
      title: 'Profil Saya',
      description: 'Kelola data akun',
      icon: User,
      color: 'text-[#8B5CF6]',
      bg: 'bg-purple-50',
      link: '/profile',
    },
  ];

  if (loading) {
    return (
      <>
        <NavbarAfter />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-[#374151]">Memuat...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-6">
          {/* Welcome Banner */}
          <div className="bg-[#FEF9C3] rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#374151] mb-2">
              Halo, {user.fullName}!
            </h2>
            <p className="text-[#374151]">
              Selamat datang di dashboard SKK Community.
            </p>
            <p className="text-[#374151] font-medium mt-1">
              {user.school} • Kelas {user.grade}
            </p>
          </div>

          {/* Renungan Hari Ini */}
          <div className="mb-8">
            <Card className="border-0 shadow">
              <CardHeader>
                <CardTitle className="text-[#374151] flex items-center gap-2">
                  <Heart size={18} />
                  Renungan Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center flex-shrink-0">
                    <Heart size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#6B7280] mb-1">
                      {renungan?.tanggal || 'Tanggal tidak diketahui'}
                    </div>
                    <h3 className="font-bold text-lg text-[#374151]">{renungan?.judul || 'Judul tidak ditemukan'}</h3>
                    <p className="text-[#374151] mt-2 italic">"{renungan?.isi || 'Tidak ada teks renungan'}"</p>
                    <div className="mt-3">
                      <span className="inline-block bg-[#FEF9C3] text-[#374151] text-xs px-2 py-1 rounded-full">
                        #{renungan?.kategori || 'Umum'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Akses Cepat */}
          <h3 className="text-xl font-bold text-[#374151] mb-4">Akses Cepat</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {shortcuts.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} to={item.link}>
                  <Card className="hover:shadow-md transition-shadow border-0 h-full">
                    <CardHeader className="pb-2">
                      <div className={`${item.bg} w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
                        <Icon size={24} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-[#374151] text-lg mb-1">{item.title}</CardTitle>
                      <p className="text-[#6B7280] text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Info Tambahan */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agenda Terdekat */}
            <Card className="border-0 shadow">
              <CardHeader>
                <CardTitle className="text-[#374151]">Agenda Terdekat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agendas.length > 0 ? (
                    agendas.map((agenda) => (
                      <div key={agenda.id}>
                        <div className="font-medium">{agenda.judul}</div>
                        <div className="text-sm text-[#6B7280]">
                          {new Date(agenda.tanggal_mulai).toLocaleDateString('id-ID')} • {agenda.lokasi}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6B7280] italic">Belum ada agenda terdekat.</p>
                  )}
                  <Button variant="link" asChild className="p-0 text-[#FACC15]">
                    <Link to="/kegiatan">Lihat semua kegiatan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Donasi Terbuka */}
            <Card className="border-0 shadow">
              <CardHeader>
                <CardTitle className="text-[#374151]">Donasi Terbuka</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">Bantuan untuk Korban Banjir</div>
                    <div className="text-sm text-[#6B7280]">Target: Rp 10.000.000</div>
                    <div className="text-xs text-[#6B7280]">Terkumpul: Rp 6.500.000</div>
                  </div>
                  <Button variant="link" asChild className="p-0 text-[#FACC15]">
                    <Link to="/donasi">Dukung sekarang</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Galeri Terbaru — Diperbarui! */}
            <Card className="border-0 shadow">
              <CardHeader>
                <CardTitle className="text-[#374151]">Galeri Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {latestAlbum ? (
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={latestAlbum.gambar_cover || 'https://via.placeholder.com/400x200?text=Galeri+Tidak+Tersedia'}
                        alt={latestAlbum.judul}
                        className="w-full h-full object-cover"
                      />
                      <div className="p-3 bg-white bg-opacity-90">
                        <span className="font-medium text-[#374151]">{latestAlbum.judul}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-r from-[#FDE68A] to-[#FACC15] rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Image size={32} className="text-white mx-auto mb-1" />
                        <span className="text-white font-medium">Retret Pemuda 2025</span>
                      </div>
                    </div>
                  )}
                  <Button variant="link" asChild className="p-0 text-[#FACC15]">
                    <Link to="/galeri">Lihat semua galeri</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}