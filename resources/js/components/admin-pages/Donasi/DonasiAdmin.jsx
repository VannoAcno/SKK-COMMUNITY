// resources/js/pages/admin/DonasiAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Edit, Trash2, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function DonasiAdmin() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [donasiCampaigns, setDonasiCampaigns] = useState([
    {
      id: 1,
      judul: 'Bantuan untuk Korban Banjir',
      deskripsi: 'Bantu saudara kita yang terdampak banjir di wilayah Surabaya Timur.',
      target: 10000000,
      terkumpul: 6500000,
      tanggal_mulai: '2025-01-01',
      tanggal_selesai: '2025-02-28',
      gambar: 'https://placehold.co/400x200/FACC15/white?text=Bantuan+Banjir',
    },
    {
      id: 2,
      judul: 'Dana Retret Pemuda 2025',
      deskripsi: 'Biaya transportasi, konsumsi, dan materi retret pemuda.',
      target: 15000000,
      terkumpul: 8200000,
      tanggal_mulai: '2025-02-01',
      tanggal_selesai: '2025-02-17',
      gambar: 'https://placehold.co/400x200/10B981/white?text=Retret+Pemuda',
    },
    {
      id: 3,
      judul: 'Pembangunan Gedung SKK',
      deskripsi: 'Membangun gedung kegiatan baru untuk komunitas.',
      target: 50000000,
      terkumpul: 12000000,
      tanggal_mulai: '2025-03-01',
      tanggal_selesai: '2025-12-31',
      gambar: 'https://placehold.co/400x200/8B5CF6/white?text=Pembangunan+Gedung',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    target: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    gambar: null,
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.judul.trim()) newErrors.judul = 'Judul wajib diisi.';
    if (!formData.target || formData.target < 1000) newErrors.target = 'Target minimal Rp1.000.';
    if (!formData.tanggal_mulai) newErrors.tanggal_mulai = 'Tanggal mulai wajib diisi.';
    if (!formData.tanggal_selesai) newErrors.tanggal_selesai = 'Tanggal selesai wajib diisi.';
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editing) {
      // Update existing
      setDonasiCampaigns(donasiCampaigns.map(c => c.id === editing.id ? { ...formData, id: editing.id } : c));
    } else {
      // Create new
      const newCampaign = {
        ...formData,
        id: Date.now(),
        terkumpul: 0,
        gambar: formData.gambar || 'https://placehold.co/400x200/FACC15/white?text=' + encodeURIComponent(formData.judul.substring(0, 15)),
      };
      setDonasiCampaigns([newCampaign, ...donasiCampaigns]);
    }

    setModalOpen(false);
    setEditing(null);
    setFormData({ judul: '', deskripsi: '', target: '', tanggal_mulai: '', tanggal_selesai: '', gambar: null });
    setErrors({});
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Kampanye donasi ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setDonasiCampaigns(donasiCampaigns.filter(c => c.id !== id));
        Swal.fire('Berhasil!', 'Kampanye donasi dihapus.', 'success');
      }
    });
  };

  const openEditModal = (campaign) => {
    setEditing(campaign);
    setFormData({
      judul: campaign.judul,
      deskripsi: campaign.deskripsi,
      target: campaign.target,
      tanggal_mulai: campaign.tanggal_mulai,
      tanggal_selesai: campaign.tanggal_selesai,
      gambar: campaign.gambar,
    });
    setModalOpen(true);
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
                    <h1 className="text-2xl font-bold text-[#374151]">Kelola Donasi</h1>
                    <p className="text-[#6B7280]">Kampanye donasi untuk pelayanan SKK.</p>
                  </div>
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    <Plus size={16} className="mr-1" />
                    Tambah Kampanye
                  </Button>
                </div>

                {/* Daftar Kampanye Donasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donasiCampaigns.map((campaign) => {
                    const progress = Math.min(100, Math.round((campaign.terkumpul / campaign.target) * 100));
                    return (
                      <Card key={campaign.id} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          {campaign.gambar && (
                            <img
                              src={campaign.gambar}
                              alt={campaign.judul}
                              className="w-full h-32 object-cover rounded-md mb-3"
                            />
                          )}
                          <h3 className="font-bold text-[#374151]">{campaign.judul}</h3>
                          <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{campaign.deskripsi}</p>
                          
                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Rp {campaign.terkumpul.toLocaleString()}</span>
                              <span>Rp {campaign.target.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#FACC15] h-2 rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-[#6B7280] mt-1">{progress}% tercapai</p>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(campaign)}
                              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(campaign.id)}
                              className="border-[#FDE68A] text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#374151]">
                {editing ? 'Edit Kampanye Donasi' : 'Tambah Kampanye Donasi Baru'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="judul" className="text-[#374151]">
                    Judul Kampanye <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="judul"
                    value={formData.judul}
                    onChange={(e) => handleChange('judul', e.target.value)}
                    placeholder="Contoh: Bantuan Korban Banjir"
                    className={errors.judul ? 'border-red-500' : ''}
                  />
                  {errors.judul && <p className="text-red-500 text-sm">{errors.judul}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deskripsi" className="text-[#374151]">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => handleChange('deskripsi', e.target.value)}
                    placeholder="Deskripsikan tujuan donasi..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target" className="text-[#374151]">
                    Target Donasi <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[#6B7280]">Rp</span>
                    <Input
                      id="target"
                      type="number"
                      value={formData.target}
                      onChange={(e) => handleChange('target', e.target.value)}
                      placeholder="10000000"
                      className={`pl-10 ${errors.target ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.target && <p className="text-red-500 text-sm">{errors.target}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_mulai" className="text-[#374151]">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                      <Input
                        id="tanggal_mulai"
                        type="date"
                        value={formData.tanggal_mulai}
                        onChange={(e) => handleChange('tanggal_mulai', e.target.value)}
                        className={`pl-10 ${errors.tanggal_mulai ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.tanggal_mulai && <p className="text-red-500 text-sm">{errors.tanggal_mulai}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_selesai" className="text-[#374151]">
                      Tanggal Selesai <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                      <Input
                        id="tanggal_selesai"
                        type="date"
                        value={formData.tanggal_selesai}
                        onChange={(e) => handleChange('tanggal_selesai', e.target.value)}
                        className={`pl-10 ${errors.tanggal_selesai ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.tanggal_selesai && <p className="text-red-500 text-sm">{errors.tanggal_selesai}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gambar" className="text-[#374151]">Gambar Kampanye</Label>
                  <Input
                    id="gambar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange('gambar', e.target.files[0])}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setModalOpen(false);
                      setEditing(null);
                    }}
                    className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308]"
                  >
                    {editing ? 'Perbarui' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}