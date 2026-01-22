// resources/js/pages/ForumPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, User, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Forum() {
  const [topiks, setTopiks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopiks = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/forum', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setTopiks(data);
      } catch (err) {
        console.error('Gagal mengambil forum:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopiks();
  }, []);

  if (loading) {
    return (
      <>
        <NavbarAfter />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-[#374151]">Memuat forum...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#374151]">Forum Diskusi</h1>
            <Button
              asChild
              className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
            >
              <Link to="/forum/tambah">
                <MessageCircle size={16} className="mr-1" />
                Buat Topik Baru
              </Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {topiks.length === 0 ? (
              <div className="text-center py-12 text-[#6B7280]">
                <MessageCircle size={48} className="mx-auto mb-4 text-[#FACC15]" />
                <p>Belum ada topik diskusi.</p>
              </div>
            ) : (
              topiks.map((topik) => (
                <Card key={topik.id} className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#374151]">{topik.judul}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#6B7280] mb-3">{topik.isi.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <User size={14} />
                        <span>{topik.user?.full_name || 'Anonim'}</span>
                        <Clock size={14} className="ml-3" />
                        <span>{new Date(topik.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                      <Button
                        variant="outline"
                        asChild
                        className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                      >
                        <Link to={`/forum/${topik.id}`}>
                          <MessageCircle size={14} className="mr-1" />
                          Lihat Diskusi ({topik.komentars_count || 0})
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}