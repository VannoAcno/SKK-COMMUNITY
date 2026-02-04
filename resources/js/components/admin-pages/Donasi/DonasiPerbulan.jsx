// resources/js/components/admin-pages/Donasi/DonasiPerBulan.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Heart,
    Calendar,
    ArrowLeft,
    Download,
    ChevronDown,
    Target,
    TrendingUp,
    Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Footer from "@/components/shared/Footer";
import AdminSidebar from "@/components/shared/AdminSidebar";

export default function DonasiPerBulan() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donasiPerBulan, setDonasiPerBulan] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [tahunList, setTahunList] = useState([]);
  const [totalDonasi, setTotalDonasi] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData.id || !userData.is_admin) {
      navigate("/home");
      return;
    }
    setAdmin(userData);
    fetchDonasiPerBulan();
  }, [navigate, tahun]);

  const fetchDonasiPerBulan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/admin/donasi-per-bulan?tahun=${tahun}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data) {
        const formattedData = formatChartData(data.data);
        setDonasiPerBulan(formattedData);
        const total = formattedData.reduce((sum, item) => sum + item.total, 0);
        setTotalDonasi(total);
        if (data.years && data.years.length > 0) {
          setTahunList(data.years);
        } else {
          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
          setTahunList(years);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data donasi per bulan:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (data) => {
    const namaBulan = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const chartData = Array(12).fill().map((_, index) => ({
      bulan: namaBulan[index],
      bulanAngka: index + 1,
      total: 0,
      jumlahDonasi: 0,
      rataRata: 0
    }));
    data.forEach(item => {
      const monthIndex = item.bulan - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        chartData[monthIndex] = {
          ...chartData[monthIndex],
          total: parseInt(item.total_donasi) || 0,
          jumlahDonasi: parseInt(item.jumlah_donasi) || 0,
          rataRata: item.jumlah_donasi > 0 ? Math.round(parseInt(item.total_donasi) / parseInt(item.jumlah_donasi)) : 0
        };
      }
    });
    return chartData;
  };

  const formatRupiah = (amount) => {
    if (amount === 0) return 'Rp 0';
    if (amount >= 1000000000) {
      return 'Rp ' + (amount / 1000000000).toFixed(1).replace(/\.?0+$/, '') + ' M';
    } else if (amount >= 1000000) {
      return 'Rp ' + (amount / 1000000).toFixed(1).replace(/\.?0+$/, '') + ' JT';
    } else if (amount >= 1000) {
      return 'Rp ' + (amount / 1000).toFixed(1).replace(/\.?0+$/, '') + ' RB';
    } else {
      return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  };

  const formatFullRupiah = (amount) => {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const exportToCSV = () => {
    // Buat BOM untuk Excel
    const BOM = "\uFEFF";
    
    // Tambahkan "sep=," untuk memaksa Excel menggunakan koma sebagai pemisah
    const separatorLine = "sep=,\n";
    
    // Siapkan data dengan format yang benar
    const rows = [];
    
    // Header tabel
    rows.push(["No", "Tanggal", "Keterangan", "Saldo"]);
    
    // Data bulanan
    donasiPerBulan.forEach((item, index) => {
      const no = index + 1;
      const tanggal = `${item.bulan} ${tahun}`;
      // Tambahkan spasi ekstra di akhir teks keterangan
      const keterangan = `Donasi Bulan ${item.bulan}                        `;
      const saldo = item.total;
      
      rows.push([no, tanggal, keterangan, saldo]);
    });
    
    // Baris total
    const totalSaldo = donasiPerBulan.reduce((sum, item) => sum + item.total, 0);
    rows.push(["", "", "Jumlah                        ", totalSaldo]);
    
    // Format data untuk CSV
    let csvContent = BOM + separatorLine;
    
    // Tambahkan setiap baris ke CSV
    rows.forEach(row => {
      // Format angka dengan benar
      const formattedRow = row.map(cell => {
        if (typeof cell === 'number') {
          // Format angka dengan format Indonesia (1.000.000)
          return cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return cell;
      });
      
      // Tambahkan baris ke CSV
      csvContent += formattedRow.join(",") + "\n";
    });
    
    // Buat file CSV yang bisa dibaca Excel
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    // Buat link untuk download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan-donasi-per-bulan-${tahun}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-[#374151]">Memuat...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#F9FAFB]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
              <div className="w-64">
                <AdminSidebar admin={admin} />
              </div>
              <div className="flex-1">
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <Heart size={48} className="mx-auto mb-4 text-[#FACC15]" />
                      <p className="text-[#374151]">Memuat data donasi...</p>
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

  // ✅ CustomTooltip dengan warna tema
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 border border-[#FDE68A] rounded-lg shadow-lg">
          <p className="font-bold text-[#374151] mb-2">{label}</p>
          <p className="text-sm text-[#6B7280]">
            Total Donasi: <span className="font-semibold text-[#FACC15]">{formatFullRupiah(payload[0].value)}</span>
          </p>
          <p className="text-sm text-[#6B7280]">
            Jumlah Donasi: <span className="font-semibold">{payload[0].payload.jumlahDonasi || 0}</span>
          </p>
          <p className="text-sm text-[#6B7280]">
            Rata-rata: <span className="font-semibold text-[#FACC15]">{formatFullRupiah(payload[0].payload.rataRata || 0)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="w-64">
              <AdminSidebar admin={admin} />
            </div>
            <div className="flex-1">
              <div className="overflow-y-auto">
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate("/admin/dashboard")}
                          className="text-[#374151] hover:text-[#FACC15] transition-colors"
                        >
                          <ArrowLeft size={24} />
                        </button>
                        <div>
                          <h1 className="text-2xl font-bold text-[#374151]">
                            Donasi Per Bulan
                          </h1>
                          <p className="text-[#6B7280]">
                            Analisis donasi bulanan untuk tahun {tahun}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={exportToCSV}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FACC15] text-black rounded-lg hover:bg-[#e0b70a] transition-colors shadow-md hover:shadow-lg"
                        >
                          <Download size={18} />
                          Export CSV
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#FDE68A] text-[#374151] rounded-lg hover:bg-[#FEF9C3] transition-colors shadow-sm hover:shadow-md"
                          >
                            <Filter size={18} />
                            {tahun}
                            <ChevronDown size={18} className={`transition-transform ${showFilter ? "rotate-180" : ""}`} />
                          </button>
                          {showFilter && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#FDE68A] rounded-lg shadow-lg z-10">
                              {tahunList.map((year) => (
                                <button
                                  key={year}
                                  onClick={() => {
                                    setTahun(year);
                                    setShowFilter(false);
                                  }}
                                  className={`w-full px-4 py-2 text-left hover:bg-[#FEF9C3] transition-colors ${tahun === year ? "bg-[#FEF9C3] font-semibold" : ""}`}
                                >
                                  {year}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <Card className="border-0 shadow-sm bg-white border border-[#FEF9C3]">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-[#6B7280]">Total Donasi</p>
                              <p className="text-2xl font-bold text-[#374151] mt-1">
                                {formatRupiah(totalDonasi)}
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-[#FEF9C3] rounded-full flex items-center justify-center border border-[#FACC15]">
                              <Target size={24} className="text-[#FACC15]" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-white border border-[#FEF9C3]">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-[#6B7280]">Rata-rata/Bulan</p>
                              <p className="text-2xl font-bold text-[#374151] mt-1">
                                {formatRupiah(Math.round(totalDonasi / 12))}
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-[#FEF9C3] rounded-full flex items-center justify-center border border-[#FACC15]">
                              <Calendar size={24} className="text-[#FACC15]" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-white border border-[#FEF9C3]">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-[#6B7280]">Total Transaksi</p>
                              <p className="text-2xl font-bold text-[#374151] mt-1">
                                {donasiPerBulan.reduce((sum, item) => sum + item.jumlahDonasi, 0)}
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-[#FEF9C3] rounded-full flex items-center justify-center border border-[#FACC15]">
                              <Heart size={24} className="text-[#FACC15]" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-white border border-[#FEF9C3]">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-[#6B7280]">Bulan Terbaik</p>
                              <p className="text-2xl font-bold text-[#374151] mt-1">
                                {(() => {
                                  const bestMonth = donasiPerBulan.reduce((max, item) => 
                                    item.total > max.total ? item : max, 
                                    { total: 0, bulan: "-" }
                                  );
                                  return bestMonth.bulan;
                                })()}
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-[#FEF9C3] rounded-full flex items-center justify-center border border-[#FACC15]">
                              <TrendingUp size={24} className="text-[#FACC15]" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mb-8">
                      <Card className="border-0 shadow-sm bg-white border border-[#FEF9C3]">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-[#374151] mb-4">
                            Grafik Donasi Bulanan
                          </h3>
                          <div style={{ width: '100%', height: 400, minHeight: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={donasiPerBulan}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis 
                                  dataKey="bulan" 
                                  stroke="#6B7280"
                                  fontSize={12}
                                />
                                <YAxis 
                                  stroke="#6B7280"
                                  fontSize={12}
                                  tickFormatter={(value) => {
                                    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'M';
                                    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'JT';
                                    if (value >= 1000) return (value / 1000).toFixed(1) + 'RB';
                                    return value;
                                  }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                  dataKey="total" 
                                  name="Total Donasi"
                                  fill="#FACC15" 
                                  radius={[4, 4, 0, 0]}
                                  barSize={30}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-0 shadow-sm bg-white border border-[#FEF9C3]">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-[#374151] mb-4">
                          Detail Donasi Per Bulan
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-[#FEF9C3]">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Bulan</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Total Donasi</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Jumlah Donasi</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Rata-rata</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Kontribusi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {donasiPerBulan.map((item, index) => {
                                const persentase = totalDonasi > 0 ? (item.total / totalDonasi * 100).toFixed(1) : 0;
                                return (
                                  <tr 
                                    key={index} 
                                    className="border-b border-[#FEF9C3] hover:bg-[#FEF9C3]/50"
                                  >
                                    <td className="px-4 py-3 text-sm text-[#374151]">
                                      {item.bulan}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-[#FACC15]">
                                      {formatFullRupiah(item.total)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#374151]">
                                      {item.jumlahDonasi}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#374151]">
                                      {formatFullRupiah(item.rataRata)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div 
                                            className="bg-[#FACC15] h-2 rounded-full" 
                                            style={{ width: `${persentase}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-xs text-[#6B7280] w-12">{persentase}%</span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr className="bg-[#FEF9C3] font-bold">
                                <td className="px-4 py-3 text-sm text-[#374151]">Total</td>
                                <td className="px-4 py-3 text-sm text-[#FACC15]">
                                  {formatFullRupiah(totalDonasi)}
                                </td>
                                <td className="px-4 py-3 text-sm text-[#374151]">
                                  {donasiPerBulan.reduce((sum, item) => sum + item.jumlahDonasi, 0)}
                                </td>
                                <td className="px-4 py-3 text-sm text-[#374151]">
                                  {formatFullRupiah(Math.round(totalDonasi / (donasiPerBulan.reduce((sum, item) => sum + item.jumlahDonasi, 0) || 1)))}
                                </td>
                                <td className="px-4 py-3 text-sm text-[#374151]">100%</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}