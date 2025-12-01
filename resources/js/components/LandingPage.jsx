import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronRight, Users, Calendar, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white text-[#111827]">
      {/* ================= HERO SECTION ================= */}
      <section className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Selamat Datang di <span className="text-[#FACC15]">SKK Community</span>
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-lg">
              Komunitas Sri Kerohanian Kristen yang berfokus membangun iman,
              kebersamaan, dan pelayanan sesama dalam lingkungan sekolah.
            </p>

            <div className="mt-8 flex gap-4">
              <Link to="/register">
                <Button className="bg-[#FACC15] text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400">
                  Bergabung Sekarang
                </Button>
              </Link>

              <Link to="/events">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl">
                  Lihat Kegiatan
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src="/hero-skk.svg"
              alt="SKK Illustration"
              className="w-80 lg:w-[420px] drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-[#1E40AF]">Tentang SKK</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            SKK (Sri Kerohanian Kristen) adalah komunitas yang berfokus untuk membangun kehidupan rohani,
            mengembangkan bakat, dan mempererat persaudaraan antar siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <Users className="w-10 h-10 text-[#3B82F6]" />
              <CardTitle className="mt-2">Komunitas Positif</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              Tempat berkumpulnya siswa untuk saling menguatkan, belajar, dan bertumbuh bersama.
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <Calendar className="w-10 h-10 text-[#3B82F6]" />
              <CardTitle className="mt-2">Kegiatan Spiritual</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              Mulai dari ibadah, renungan, hingga kegiatan sosial yang membangun karakter.
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <MessageCircle className="w-10 h-10 text-[#3B82F6]" />
              <CardTitle className="mt-2">Forum Diskusi</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              Tempat berbagi cerita, pertanyaan, dan pengalaman rohani.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================= KEGIATAN SECTION ================= */}
      <section className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-[#1E40AF]">Kegiatan Terbaru</h2>
          <p className="mt-4 text-gray-600">
            Ikuti berbagai kegiatan yang memperkuat iman dan kebersamaan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
          {[1, 2, 3].map((item) => (
            <Card className="rounded-2xl shadow-lg" key={item}>
              <img
                src={`https://source.unsplash.com/random/800x600?church,community,${item}`}
                alt="Event"
                className="rounded-t-2xl h-48 w-full object-cover"
              />
              <CardHeader>
                <CardTitle className="text-lg">Kegiatan Rohani #{item}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Kegiatan komunitas untuk membangun kebersamaan dan memperkuat iman siswa.
              </CardContent>

              <div className="px-6 pb-6">
                <Link to={`/events/${item}`}>
                  <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= FORUM PREVIEW ================= */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#1E40AF]">Forum Diskusi</h2>

          <Link to="/forum">
            <Button variant="outline" className="flex items-center gap-2 border-[#1E40AF] text-[#1E40AF]">
              Lihat Semua <ChevronRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[1, 2].map((f) => (
            <Card className="rounded-2xl shadow-md" key={f}>
              <CardHeader>
                <CardTitle className="text-xl">
                  Diskusi Rohani #{f}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Topik diskusi untuk memperdalam pemahaman rohani dan saling menguatkan.
              </CardContent>

              <div className="px-6 pb-6">
                <Link to={`/forum/${f}`}>
                  <Button className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white">
                    Buka Diskusi
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1E40AF] text-white py-10 px-6 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg font-semibold">SKK Community</p>
          <p className="text-blue-200">© 2025 - Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}

