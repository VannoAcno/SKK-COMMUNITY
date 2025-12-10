// resources/js/pages/admin/GaleriAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function GaleriAdmin() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [galeriItems, setGaleriItems] = useState([
    {
      id: 1,
      judul: 'Retret Pemuda 2025',
      deskripsi: 'Kegembiraan bersama Tuhan di hari pertama retret.',
      tanggal: '2025-02-15',
      kategori: 'Retret',
      url: 'https://placehold.co/400x300/FACC15/white?text=Retret+Pemuda',
      uploaded_by: 'Admin SKK',
    },
    {
      id: 2,
      judul: 'Bakti Sosial Anak Yatim',
      deskripsi: 'Membagikan semangat kasih kepada anak-anak yatim.',
      tanggal: '2025-03-22',
      kategori: 'Bakti Sosial',
      url: 'https://placehold.co/400x300/10B981/white?text=Bakti+Sosial',
      uploaded_by: 'Tim Donasi',
    },
    {
      id: 3,
      judul: 'Kebaktian Mingguan',
      deskripsi: 'Ibadah bersama jemaat di Gereja SKK.',
      tanggal: '2025-01-12',
      kategori: 'Ibadah',
      url: 'https://placehold.co/400x300/8B5CF6/white?text=Kebaktian',
      uploaded_by: 'Admin SKK',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal: '',
    kategori: '',
    foto: null,
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // ✅ Sudah didefinisikan!

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
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal wajib diisi.';
    if (!formData.kategori) newErrors.kategori = 'Kategori wajib diisi.';
    if (!formData.foto && !editing) newErrors.foto = 'Foto wajib diunggah.';
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editing) {
      setGaleriItems(galeriItems.map(item => 
        item.id === editing.id ? { ...formData, id: editing.id, url: formData.foto ? URL.createObjectURL(formData.foto) : editing.url } : item
      ));
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        url: URL.createObjectURL(formData.foto),
        uploaded_by: admin.full_name,
      };
      setGaleriItems([newItem, ...galeriItems]);
    }

    setModalOpen(false);
    setEditing(null);
    setFormData({ judul: '', deskripsi: '', tanggal: '', kategori: '', foto: null });
    setErrors({});
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus foto ini?',
      text: 'Foto akan dihapus dari galeri.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setGaleriItems(galeriItems.filter(item => item.id !== id));
        Swal.fire('Berhasil!', 'Foto dihapus dari galeri.', 'success');
      }
    });
  };

  const openEditModal = (item) => {
    setEditing(item);
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi,
      tanggal: item.tanggal,
      kategori: item.kategori,
      foto: null,
    });
    setModalOpen(true);
  };

  // Filter items berdasarkan searchTerm
  const filteredItems = galeriItems.filter(item => {
    return (
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
                    <h1 className="text-2xl font-bold text-[#374151]">Galeri Kegiatan</h1>
                    <p className="text-[#6B7280]">Kelola foto-foto kegiatan SKK Community.</p>
                  </div>
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    <Plus size={16} className="mr-1" />
                    Tambah Foto
                  </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Input
                      placeholder="Cari foto berdasarkan judul, kategori, atau pengunggah..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // ✅ Gunakan setSearchTerm
                      className="pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15]"
                    />
                  </div>
                </div>

                {/* Grid Galeri */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="border-0 shadow-sm overflow-hidden">
                      <CardContent className="p-0">
                        <img
                          src={item.url}
                          alt={item.judul}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/400x300/FACC15/white?text=' + encodeURIComponent(item.judul.substring(0, 15));
                          }}
                        />
                        <div className="p-3">
                          <h3 className="font-bold text-[#374151] truncate">{item.judul}</h3>
                          <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{item.deskripsi}</p>
                          <div className="flex justify-between items-center mt-2 text-xs text-[#6B7280]">
                            <span>{new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                            <span className="bg-[#FEF9C3] px-2 py-1 rounded-full">{item.kategori}</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(item)}
                              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3] flex-1"
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                              className="border-[#FDE68A] text-red-500 hover:bg-red-50 flex-1"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12 text-[#6B7280]">
                    <ImageIcon size={48} className="mx-auto mb-4 text-[#FACC15]" />
                    <p>Foto galeri tidak ditemukan.</p>
                  </div>
                )}
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
                {editing ? 'Edit Foto Galeri' : 'Tambah Foto Baru'}
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
                    Judul Foto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="judul"
                    value={formData.judul}
                    onChange={(e) => handleChange('judul', e.target.value)}
                    placeholder="Contoh: Retret Pemuda 2025"
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
                    placeholder="Deskripsikan foto ini..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal" className="text-[#374151]">
                      Tanggal <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => handleChange('tanggal', e.target.value)}
                        className={`pl-10 ${errors.tanggal ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.tanggal && <p className="text-red-500 text-sm">{errors.tanggal}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kategori" className="text-[#374151]">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => handleChange('kategori', e.target.value)}
                      className={`border-[#FDE68A] rounded-md px-4 py-2 focus:ring-[#FACC15] focus:outline-none ${
                        errors.kategori ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Pilih kategori</option>
                      <option value="Retret">Retret</option>
                      <option value="Bakti Sosial">Bakti Sosial</option>
                      <option value="Ibadah">Ibadah</option>
                      <option value="Pelayanan">Pelayanan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    {errors.kategori && <p className="text-red-500 text-sm">{errors.kategori}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foto" className="text-[#374151]">
                    Foto <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="foto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChange('foto', e.target.files[0])}
                      className="file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#FEF9C3] file:text-[#374151] file:font-medium file:hover:bg-[#FEF9C3]/80"
                    />
                  </div>
                  {errors.foto && <p className="text-red-500 text-sm">{errors.foto}</p>}
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