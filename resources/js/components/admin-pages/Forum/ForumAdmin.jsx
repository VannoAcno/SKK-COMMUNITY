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
  const [forumTopics, setForumTopics] = useState([
    {
      id: 1,
      title: 'Apa renunganmu hari ini?',
      content: 'Saya merenungkan tentang Yeremia 29:11...',
      author: 'Maria S.',
      author_avatar: 'https://ui-avatars.com/api/?name=Maria+S.&background=FACC15&color=ffffff',
      created_at: '2025-01-10',
      replies_count: 12,
      status: 'active', // active, flagged, resolved
      category: 'Renungan',
    },
    {
      id: 2,
      title: 'Persiapan Retret Pemuda 2025',
      content: 'Apakah ada yang sudah mendaftar? Bagaimana persiapannya?',
      author: 'Tim SKK',
      author_avatar: 'https://ui-avatars.com/api/?name=Tim+SKK&background=10B981&color=ffffff',
      created_at: '2025-01-09',
      replies_count: 24,
      status: 'flagged', // misal: ada komentar ofensif
      category: 'Acara',
    },
    {
      id: 3,
      title: 'Doa untuk teman yang sakit',
      content: 'Mohon doakan untuk Yohanes yang sedang dirawat di RS.',
      author: 'Yohanes T.',
      author_avatar: 'https://ui-avatars.com/api/?name=Yohanes+T.&background=8B5CF6&color=ffffff',
      created_at: '2025-01-08',
      replies_count: 8,
      status: 'resolved',
      category: 'Doa',
    },
    {
      id: 4,
      title: 'Diskusi tentang Yesaya 40:31',
      content: 'Bagaimana kita bisa "menanti-nantikan TUHAN" dalam hidup sehari-hari?',
      author: 'Santi P.',
      author_avatar: 'https://ui-avatars.com/api/?name=Santi+P.&background=F59E0B&color=ffffff',
      created_at: '2025-01-07',
      replies_count: 5,
      status: 'active',
      category: 'Firman Tuhan',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Load admin dari localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
  }, [navigate]);

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

  const handleDeleteTopic = (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus topik ini?',
      text: 'Semua komentar di dalamnya juga akan dihapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setForumTopics(forumTopics.filter(t => t.id !== id));
        Swal.fire('Berhasil!', 'Topik dihapus.', 'success');
      }
    });
  };

  const handleResolveFlag = (id) => {
    setForumTopics(forumTopics.map(topic => 
      topic.id === id ? { ...topic, status: 'resolved' } : topic
    ));
    Swal.fire('Berhasil!', 'Topik telah diselesaikan.', 'success');
  };

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
                            <img
                              src={topic.author_avatar}
                              alt={topic.author}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.author)}&background=FACC15&color=ffffff`;
                              }}
                            />
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
                                {topic.replies_count} balasan
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