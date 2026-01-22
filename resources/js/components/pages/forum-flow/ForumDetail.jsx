// resources/js/pages/ForumDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, User, Clock, Trash2, Pencil } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2';

export default function ForumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topik, setTopik] = useState(null);
  const [komentar, setKomentar] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id) {
      window.location.href = '/login';
      return;
    }
    setCurrentUser(userData);

    const fetchTopik = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/forum/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setTopik(data);
      } catch (err) {
        console.error('Gagal mengambil detail forum:', err);
        navigate('/forum');
      } finally {
        setLoading(false);
      }
    };
    fetchTopik();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!komentar.trim()) return;

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/forum/${id}/komentar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isi: komentar })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal menambahkan komentar');
      }

      setKomentar('');
      // Refresh data
      setTopik(prev => ({
        ...prev,
        komentars: [...prev.komentars, result]
      }));
    } catch (err) {
      console.error('Gagal menambahkan komentar:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat menambahkan komentar.',
        confirmButtonColor: '#FACC15', // ✅ Warna kuning SKK
      });
    }
  };

  const handleDeleteKomentar = async (komentarId) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus komentar ini?',
      text: 'Komentar akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/forum/komentar/${komentarId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Gagal menghapus dari server');
        }
        
        // Hapus dari state
        setTopik(prev => ({
          ...prev,
          komentars: prev.komentars.filter(k => k.id !== komentarId)
        }));
        
        Swal.fire({
          title: 'Berhasil!',
          text: data.message,
          icon: 'success',
          confirmButtonColor: '#FACC15', 
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err.message || 'Tidak dapat menghapus komentar.',
          confirmButtonColor: '#FACC15', 
        });
      }
    }
  };

  const handleEditKomentar = async (komentarId, currentIsi) => {
    const { value: newIsi } = await Swal.fire({
      title: 'Edit Komentar',
      input: 'textarea',
      inputLabel: 'Isi Komentar',
      inputPlaceholder: 'Masukkan isi komentar baru...',
      inputValue: currentIsi,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Komentar tidak boleh kosong!';
        }
      },
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
    });

    if (newIsi) {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/forum/komentar/${komentarId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isi: newIsi })
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Gagal mengedit komentar');
        }

        // Update komentar di state
        setTopik(prev => ({
          ...prev,
          komentars: prev.komentars.map(k => 
            k.id === komentarId ? { ...k, isi: result.isi } : k
          )
        }));

        Swal.fire({
          title: 'Berhasil!',
          text: 'Komentar berhasil diedit.',
          icon: 'success',
          confirmButtonColor: '#FACC15', // ✅ Warna kuning SKK (sama seperti delete)
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err.message || 'Tidak dapat mengedit komentar.',
          confirmButtonColor: '#FACC15', // ✅ Warna kuning SKK (sama seperti delete)
        });
      }
    }
  };

  if (loading) {
    return (
      <>
        <NavbarAfter />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-[#374151]">Memuat diskusi...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!topik) {
    return (
      <>
        <NavbarAfter />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle size={48} className="mx-auto mb-4 text-[#FACC15]" />
            <p className="text-[#374151]">Topik tidak ditemukan.</p>
            <Button variant="outline" onClick={() => navigate('/forum')} className="mt-4">
              Kembali ke Forum
            </Button>
          </div>
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
          <Button
            variant="outline"
            onClick={() => navigate('/forum')}
            className="mb-6 border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
          >
            ← Kembali ke Forum
          </Button>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#374151]">{topik.judul}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <User size={14} />
                <span>{topik.user?.full_name || 'Anonim'}</span>
                <Clock size={14} className="ml-3" />
                <span>{new Date(topik.created_at).toLocaleDateString('id-ID')}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#374151] mb-6">{topik.isi}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#374151] mb-4">
                  Komentar ({topik.komentars?.length || 0})
                </h3>
                
                <div className="space-y-4">
                  {topik.komentars?.map((komentar) => (
                    <Card key={komentar.id} className="border-0 bg-[#FEF9C3]/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center">
                            {komentar.user?.avatar ? (
                              <img
                                src={komentar.user.avatar}
                                alt={komentar.user.full_name}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(komentar.user.full_name || 'A')}&background=FACC15&color=ffffff`;
                                }}
                              />
                            ) : (
                              <User size={12} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 text-sm text-[#6B7280] mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{komentar.user?.full_name || 'Anonim'}</span>
                                <Clock size={12} />
                                <span>{new Date(komentar.created_at).toLocaleDateString('id-ID')}</span>
                              </div>
                              
                              {/* Tombol Edit & Hapus hanya muncul jika user adalah pemilik komentar */}
                              {currentUser?.id === komentar.user_id && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditKomentar(komentar.id, komentar.isi)}
                                    className="text-blue-500 hover:text-blue-700 p-1 h-6 w-6"
                                  >
                                    <Pencil size={12} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteKomentar(komentar.id)}
                                    className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <p className="text-[#374151]">{komentar.isi}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex gap-2">
                  <Input
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    placeholder="Tulis komentar..."
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-[#FACC15] text-black hover:bg-[#EAB308]">
                    Kirim
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}