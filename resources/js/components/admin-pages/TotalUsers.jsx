// resources/js/pages/admin/UsersAdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, User, Calendar, School, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';

export default function TotalUsers() {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Gagal mengambil data users:', err);
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

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl text-[#374151]">Manajemen Pengguna</CardTitle>
                      <p className="text-[#6B7280]">Total: {users.length} pengguna terdaftar</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                      <Input
                        placeholder="Cari pengguna berdasarkan nama, email, atau sekolah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15]"
                      />
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#FEF9C3]/30">
                          <TableHead className="text-[#374151] font-semibold">No</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Nama Lengkap</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Email</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Tanggal Lahir</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Sekolah</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Kelas</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Jurusan</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Role</TableHead>
                          <TableHead className="text-[#374151] font-semibold">Didaftar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user, index) => (
                            <TableRow key={user.id} className="hover:bg-[#FEF9C3]/10">
                              <TableCell className="text-[#6B7280]">{index + 1}</TableCell>
                              <TableCell className="font-medium text-[#374151]">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center overflow-hidden">
                                    {user.avatar ? (
                                      <img
                                        src={user.avatar}
                                        alt={user.full_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'A')}&background=FACC15&color=ffffff`;
                                        }}
                                      />
                                    ) : (
                                      <User size={14} className="text-white" />
                                    )}
                                  </div>
                                  {user.full_name}
                                </div>
                              </TableCell>
                              <TableCell className="text-[#6B7280]">{user.email}</TableCell>
                              <TableCell className="text-[#6B7280]">
                                {user.birth_date ? new Date(user.birth_date).toLocaleDateString('id-ID') : '-'}
                              </TableCell>
                              <TableCell className="text-[#6B7280]">{user.school}</TableCell>
                              <TableCell className="text-[#6B7280]">{user.grade}</TableCell>
                              <TableCell className="text-[#6B7280]">{user.major || '-'}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.is_admin ? "destructive" : "default"}
                                  className={user.is_admin ? "bg-red-500 hover:bg-red-600" : "bg-[#FACC15] text-black hover:bg-[#EAB308]"}
                                >
                                  {user.is_admin ? 'Admin' : 'User'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-[#6B7280]">
                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan="8" className="text-center text-[#6B7280] py-8">
                              {loading ? 'Memuat data...' : 'Tidak ada pengguna ditemukan'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
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