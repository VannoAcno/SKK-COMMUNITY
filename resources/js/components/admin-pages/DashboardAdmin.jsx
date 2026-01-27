// resources/js/pages/admin/DashboardAdmin.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    BarChart3,
    Users,
    Calendar,
    Heart,
    MessageCircle,
    Eye,
    Activity,
    User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/shared/Footer";
import AdminSidebar from "@/components/shared/AdminSidebar";

export default function DashboardAdmin() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalKegiatan: 0,
        totalDiskusi: 0,
        totalDonasi: 0,
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentDonations, setRecentDonations] = useState([]);
    const navigate = useNavigate();

    // Load admin data dari localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (!userData.id || !userData.is_admin) {
            navigate("/home");
            return;
        }
        setAdmin(userData);
        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");

            // Fetch semua data secara paralel
            const [usersRes, kegiatanRes, forumRes, kampanyeRes, donasiRes] = await Promise.all([
                fetch("/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/admin/kegiatans", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/admin/forum-topik", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/admin/donasi-kampanye", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/admin/donasi?status=success", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const [usersData, kegiatanData, forumData, kampanyeData, donasiData] = await Promise.all([
                usersRes.json(),
                kegiatanRes.json(),
                forumRes.json(),
                kampanyeRes.json(),
                donasiRes.json(),
            ]);

            // Hitung total donasi dari semua kampanye
            let totalDonasiAmount = 0;
            if (kampanyeData.success && kampanyeData.data) {
                totalDonasiAmount = kampanyeData.data.reduce((sum, kampanye) => {
                    return sum + (parseInt(kampanye.total_donasi) || 0);
                }, 0);
            }

            // Set stats dengan data dari backend
            setStats({
                totalUsers: usersData.length,
                totalKegiatan: kegiatanData.length,
                totalDiskusi: forumData.length,
                totalDonasi: totalDonasiAmount,
            });

            // --- PERBAIKAN: Ambil avatar dari user ---
            const activities = [
                ...usersData.slice(0, 2).map((user) => ({
                    id: user.id,
                    user: user.full_name,
                    avatar: user.avatar,
                    action: "mendaftar sebagai pengguna",
                    time: new Date(user.created_at).toLocaleString("id-ID"),
                    type: "user",
                })),
                ...kegiatanData.slice(0, 2).map((kegiatan) => {
                    const user = kegiatan.user;
                    return {
                        id: kegiatan.id,
                        user: user?.full_name || "Admin",
                        avatar: user?.avatar,
                        action: `membuat kegiatan "${kegiatan.judul}"`,
                        time: new Date(kegiatan.created_at).toLocaleString("id-ID"),
                        type: "kegiatan",
                    };
                }),
                ...forumData.slice(0, 2).map((topik) => {
                    return {
                        id: topik.id,
                        user: topik.user?.full_name || "Pengguna",
                        avatar: topik.user?.avatar,
                        action: `membuat diskusi "${topik.judul}"`,
                        time: new Date(topik.created_at).toLocaleString("id-ID"),
                        type: "diskusi",
                    };
                }),
            ]
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .slice(0, 4);

            setRecentActivities(activities);

            // Set recent donations (maksimal 3 terbaru)
            if (donasiData.success && donasiData.data) {
                const recentDonations = donasiData.data.slice(0, 3).map((donasi) => ({
                    id: donasi.id,
                    donor: donasi.nama || donasi.user?.full_name || "Anonim",
                    amount: donasi.nominal,
                    date: new Date(donasi.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    }),
                    campaign: donasi.kampanye?.judul || "Donasi Umum",
                }));
                setRecentDonations(recentDonations);
            }

        } catch (err) {
            console.error("Gagal mengambil data dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi format donasi yang lebih ringkas
    const formatDonasi = (amount) => {
        if (amount === 0) return 'Rp 0';
        
        if (amount >= 1000000000) {
            return 'Rp ' + (amount / 1000000000).toFixed(1).replace(/\.?0+$/, '') + ' M';
        } else if (amount >= 1000000) {
            return 'Rp ' + (amount / 1000000).toFixed(1).replace(/\.?0+$/, '') + ' JT';
        } else if (amount >= 1000) {
            return 'Rp ' + (amount / 1000).toFixed(1).replace(/\.?0+$/, '') + ' RB';
        } else {
            return 'Rp ' + amount;
        }
    };

    // Konfigurasi stats dengan penyesuaian tata letak
    const statsConfig = [
        {
            title: "Total Pengguna",
            value: stats.totalUsers,
            icon: Users,
            color: "bg-[#FACC15]",
            path: "/admin/users",
        },
        {
            title: "Total Kegiatan",
            value: stats.totalKegiatan,
            icon: Calendar,
            color: "bg-[#3B82F6]",
            path: "/admin/kegiatans",
        },
        {
            title: "Total Diskusi",
            value: stats.totalDiskusi,
            icon: MessageCircle,
            color: "bg-[#8B5CF6]",
            path: "/admin/forum",
        },
        {
            title: "Total Donasi",
            value: formatDonasi(stats.totalDonasi),
            icon: Heart,
            color: "bg-[#10B981]",
            path: "/admin/donasis",
        },
    ];

    if (!admin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-[#374151]">Memuat...</div>
            </div>
        );
    }

    if (loading) {
        return (
            <>
                <div className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex gap-8">
                            <div className="w-64">
                                <AdminSidebar admin={admin} />
                            </div>
                            <div className="flex-1">
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-center py-12">
                                            <BarChart3
                                                size={48}
                                                className="mx-auto mb-4 text-[#FACC15]"
                                            />
                                            <p className="text-[#374151]">
                                                Memuat data dashboard...
                                            </p>
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
                                        <h1 className="text-2xl font-bold text-[#374151]">
                                            Dashboard Admin
                                        </h1>
                                        <p className="text-[#6B7280]">
                                            Ringkasan aktivitas sistem dan statistik komunitas.
                                        </p>
                                    </div>

                                    {/* Statistik Utama */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        {statsConfig.map((stat, index) => {
                                            const Icon = stat.icon;
                                            return (
                                                <div
                                                    key={index}
                                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                                    onClick={() => navigate(stat.path)}
                                                >
                                                    <Card className="border-0 shadow-sm h-full">
                                                        <CardContent className="p-6 flex flex-col h-full">
                                                            <div className="flex justify-between items-start flex-1">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-[#6B7280]">
                                                                        {stat.title}
                                                                    </p>
                                                                    <p className="text-2xl font-bold text-[#374151] whitespace-nowrap overflow-hidden text-ellipsis">
                                                                        {stat.value}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center ml-4`}
                                                                >
                                                                    <Icon
                                                                        size={24}
                                                                        className="text-white"
                                                                    />
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
                                                    <Activity
                                                        size={18}
                                                        className="text-[#374151]"
                                                    />
                                                    <h3 className="text-lg font-bold text-[#374151]">
                                                        Aktivitas Terbaru
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {recentActivities.length > 0 ? (
                                                        recentActivities.map((activity) => (
                                                            <div
                                                                key={activity.id}
                                                                className="flex items-center gap-3 p-3 bg-[#FEF9C3]/30 rounded-md"
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center overflow-hidden">
                                                                    {activity.avatar ? (
                                                                        <img
                                                                            src={activity.avatar}
                                                                            alt={activity.user}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user || "A")}&background=FACC15&color=ffffff`;
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <User
                                                                            size={14}
                                                                            className="text-white"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-[#374151]">
                                                                        <span className="font-semibold">
                                                                            {activity.user}
                                                                        </span>{" "}
                                                                        {activity.action}
                                                                    </p>
                                                                    <p className="text-xs text-[#6B7280]">
                                                                        {activity.time}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4 text-[#6B7280]">
                                                            Belum ada aktivitas terbaru
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Donasi Terbaru (DATA DARI BACKEND) */}
                                        <Card className="border-0 shadow-sm">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Heart
                                                        size={18}
                                                        className="text-[#374151]"
                                                    />
                                                    <h3 className="text-lg font-bold text-[#374151]">
                                                        Donasi Terbaru
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {recentDonations.length > 0 ? (
                                                        recentDonations.map((donation) => (
                                                            <div
                                                                key={donation.id}
                                                                className="flex justify-between items-center p-3 border border-[#FDE68A] rounded-lg"
                                                            >
                                                                <div>
                                                                    <p className="font-medium text-[#374151]">
                                                                        {donation.donor}
                                                                    </p>
                                                                    <p className="text-sm text-[#6B7280]">
                                                                        {donation.campaign}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold text-[#374151]">
                                                                        {formatDonasi(donation.amount)}
                                                                    </p>
                                                                    <p className="text-xs text-[#6B7280]">
                                                                        {donation.date}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4 text-[#6B7280]">
                                                            Belum ada donasi terbaru
                                                        </div>
                                                    )}
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