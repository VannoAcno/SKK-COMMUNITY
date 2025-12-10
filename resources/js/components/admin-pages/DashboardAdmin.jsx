// resources/js/pages/admin/DashboardAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Users, Calendar, Heart, MessageCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';
import AdminSidebar from '@/components/shared/AdminSidebar';

export default function DashboardAdmin() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // Mock data untuk statistik
  const stats = [
    {
      title: 'Total Pengguna',
      value: '124',
      icon: Users,
      color: 'bg-[#FACC15]',
      change: '+12%',
      path: '/admin/users',
    },
    {
      title: 'Total Kegiatan',
      value: '18',
      icon: Calendar,
      color: 'bg-[#3B82F6]',
      change: '+3%',
      path: '/admin/kegiatan',
    },
    {
      title: 'Total Donasi',
      value: 'Rp245jt',
      icon: Heart,
      color: 'bg-[#10B981]',
      change: '+25%',
      path: '/admin/donasi',
    },
    {
      title: 'Total Diskusi',
      value: '234',
      icon: MessageCircle,
      color: 'bg-[#8B5CF6]',
      change: '+8%',
      path: '/admin/forum',
    },
  ];

  const recentActivities = [
    { id: 1, user: 'Budi Santoso', action: 'mengedit profil', time: '5 menit lalu' },
    { id: 2, user: 'Maria K.', action: 'membuat kegiatan baru', time: '1 jam lalu' },
    { id: 3, user: 'Admin SKK', action: 'menghapus komentar', time: '2 jam lalu' },
    { id: 4, user: 'Yohanes T.', action: 'mengirim donasi', time: '3 jam lalu' },
  ];

  const latestDonations = [
    { donor: 'Andi Prasetyo', amount: 'Rp 500.000', date: '15 Jan 2025', campaign: 'Bantuan Banjir' },
    { donor: 'Siti Rahma', amount: 'Rp 1.000.000', date: '14 Jan 2025', campaign: 'Retret Pemuda' },
    { donor: 'Joko Widodo', amount: 'Rp 750.000', date: '13 Jan 2025', campaign: 'Pembangunan Gedung' },
  ];

  // Load admin data dari localStorage
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

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar Eksternal */}
            <div className="w-64">
              <AdminSidebar admin={admin} />
            </div>

            {/* Konten Utama */}
            <div className="flex-1">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#374151]">Dashboard Admin</h1>
                    <p className="text-[#6B7280]">Ringkasan aktivitas sistem dan statistik komunitas.</p>
                  </div>

                  {/* Statistik Utama */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => navigate(stat.path)}
                        >
                          <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-[#6B7280]">{stat.title}</p>
                                  <p className="text-2xl font-bold text-[#374151]">{stat.value}</p>
                                  <p className="text-xs text-[#10B981] mt-1">{stat.change} dari bulan lalu</p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                                  <Icon size={24} className="text-white" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aktivitas & Donasi */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Aktivitas Terbaru */}
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Eye size={18} className="text-[#374151]" />
                          <h3 className="text-lg font-bold text-[#374151]">Aktivitas Terbaru</h3>
                        </div>
                        <div className="space-y-3">
                          {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3 p-3 bg-[#FEF9C3]/30 rounded-md">
                              <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center text-white text-xs font-bold">
                                {activity.user.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#374151]">
                                  <span className="font-semibold">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-[#6B7280]">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Donasi Terbaru */}
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Heart size={18} className="text-[#374151]" />
                          <h3 className="text-lg font-bold text-[#374151]">Donasi Terbaru</h3>
                        </div>
                        <div className="space-y-3">
                          {latestDonations.map((donation, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border border-[#FDE68A] rounded-lg">
                              <div>
                                <p className="font-medium text-[#374151]">{donation.donor}</p>
                                <p className="text-sm text-[#6B7280]">{donation.campaign}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#374151]">{donation.amount}</p>
                                <p className="text-xs text-[#6B7280]">{donation.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
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