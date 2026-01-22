// resources/js/pages/admin/ForumAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Search, MessageCircle, User, Trash2, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function ForumAdmin() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [forumTopics, setForumTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load admin dari localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
    fetchTopics();
  }, [navigate]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/forum', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal memuat data forum');
      const data = await res.json();
      
      // Format data agar sesuai dengan struktur frontend
      const formattedData = data.map(topic => ({
        id: topic.id,
        title: topic.judul,
        content: topic.isi,
        author: topic.user?.full_name || 'Anonim',
        created_at: topic.created_at,
        replies_count: topic.komentars_count || 0, // ✅ Gunakan komentars_count
        status: 'active', // API belum support status, jadi default active
        category: 'Umum'  // API belum support category, jadi default Umum
      }));

      setForumTopics(formattedData);
    } catch (err) {
      console.error('Gagal mengambil forum:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat daftar forum.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#374151]">Memuat...</div>
      </div>
    );
  }

  const filteredTopics = forumTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          topic.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || topic.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteTopic = async (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus topik ini?',
      text: 'Semua komentar di dalamnya juga akan dihapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('auth_token');
          const res = await fetch(`/api/admin/forum-topik/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!res.ok) throw new Error('Gagal menghapus topik');

          setForumTopics(forumTopics.filter(t => t.id !== id));
          Swal.fire('Berhasil!', 'Topik dihapus.', 'success');
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Tidak dapat menghapus topik: ' + err.message,
            confirmButtonColor: '#FACC15',
          });
        }
      }
    });
  };

  const handleResolveFlag = (id) => {
    // API belum support resolve flag, jadi hanya update lokal dulu
    setForumTopics(forumTopics.map(topic => 
      topic.id === id ? { ...topic, status: 'resolved' } : topic
    ));
    Swal.fire('Berhasil!', 'Topik telah diselesaikan.', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#374151]">Memuat forum...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64">
            <AdminSidebar admin={admin} />
          </div>

          {/* Konten Utama */}
          <div className="flex-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-[#374151]">Moderasi Forum</h1>
                    <p className="text-[#6B7280]">Kelola diskusi komunitas SKK.</p>
                  </div>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <Input
                      placeholder="Cari topik, konten, atau penulis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15]"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border-[#FDE68A] rounded-md px-4 py-2 focus:ring-[#FACC15] focus:outline-none"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="flagged">Perlu Tinjauan</option>
                    <option value="resolved">Sudah Diselesaikan</option>
                  </select>
                </div>

                {/* Daftar Topik Forum */}
                <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <Card key={topic.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Avatar Penulis */}
                          <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-white" />
                          </div>

                          {/* Konten Topik */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-bold text-[#374151]">{topic.title}</h3>
                              <div className="flex gap-2">
                                {topic.status === 'flagged' && (
                                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                                    <AlertTriangle size={14} className="mr-1" />
                                    Perlu Tinjauan
                                  </Badge>
                                )}
                                {topic.status === 'resolved' && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle size={14} className="mr-1" />
                                    Sudah Ditinjau
                                  </Badge>
                                )}
                                {topic.status === 'active' && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Aktif
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="bg-[#FEF9C3] text-[#374151]">
                                  {topic.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-[#6B7280] mt-1">
                              Oleh <span className="font-medium">{topic.author}</span> •{' '}
                              {new Date(topic.created_at).toLocaleDateString('id-ID')}
                            </p>
                            
                            <p className="text-sm text-[#374151] mt-2 line-clamp-2">
                              {topic.content}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-3 text-sm text-[#6B7280]">
                              <div className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                {topic.replies_count} balasan  {/* ✅ Sudah benar */}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/forum/${topic.id}`)}
                                  className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                                >
                                  <Eye size={14} className="mr-1" />
                                  Lihat
                                </Button>
                                {topic.status === 'flagged' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleResolveFlag(topic.id)}
                                    className="border-[#FDE68A] text-green-600 hover:bg-green-50"
                                  >
                                    <CheckCircle size={14} className="mr-1" />
                                    Selesaikan
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteTopic(topic.id)}
                                  className="border-[#FDE68A] text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={14} className="mr-1" />
                                  Hapus
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredTopics.length === 0 && (
                  <div className="text-center py-12 text-[#6B7280]">
                    <MessageCircle size={48} className="mx-auto mb-4 text-[#FACC15]" />
                    <p>Topik forum tidak ditemukan.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}