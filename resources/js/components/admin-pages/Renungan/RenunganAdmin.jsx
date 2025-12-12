// resources/js/pages/admin/RenunganAdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar, Heart, Edit, Trash2, Plus } from 'lucide-react';
import { Check, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Swal from 'sweetalert2';

export default function RenunganAdmin() {
  const navigate = useNavigate();

  // ✅ Data dummy renungan
  const [renungans, setRenungans] = useState([
    {
      id: 1,
      tanggal: '2025-01-15',
      ayat: 'Yeremia 29:11',
      teks: 'Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu...',
      refleksi: 'Tuhan memiliki rencana indah untuk hidup kita...',
      kategori: 'Harapan',
    },
    {
      id: 2,
      tanggal: '2025-01-14',
      ayat: 'Filipi 4:13',
      teks: 'Segala perkara dapat kutanggung dalam Dia yang memberi kekuatan kepadaku.',
      refleksi: 'Kita bisa menghadapi segala hal dengan kekuatan Tuhan...',
      kategori: 'Pengharapan',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: '',
    ayat: '',
    teks: '',
    refleksi: '',
    kategori: 'Harapan',
  });

  const [errors, setErrors] = useState({});
  const [admin, setAdmin] = useState(null);

  // Daftar kategori
  const kategoris = [
    'Harapan',
    'Kasih',
    'Iman',
    'Doa',
    'Pelayanan',
    'Lainnya',
  ];

  // Ambil data admin dari localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || !userData.is_admin) {
      navigate('/home');
      return;
    }
    setAdmin(userData);
  }, [navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal wajib diisi.';
    if (!formData.ayat.trim()) newErrors.ayat = 'Ayat wajib diisi.';
    if (!formData.teks.trim()) newErrors.teks = 'Teks ayat wajib diisi.';
    if (!formData.refleksi.trim()) newErrors.refleksi = 'Refleksi wajib diisi.';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editing) {
      setRenungans(renungans.map(r => r.id === editing.id ? { ...formData, id: editing.id } : r));
    } else {
      const newRenungan = {
        ...formData,
        id: Date.now(),
      };
      setRenungans([newRenungan, ...renungans]);
    }

    setModalOpen(false);
    setEditing(null);
    setFormData({ tanggal: '', ayat: '', teks: '', refleksi: '', kategori: 'Harapan' });
    setErrors({});
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus renungan ini?',
      text: 'Renungan akan dihapus dari daftar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setRenungans(renungans.filter(r => r.id !== id));
        Swal.fire('Terhapus!', 'Renungan berhasil dihapus.', 'success');
      }
    });
  };

  const openEditModal = (renungan) => {
    setEditing(renungan);
    setFormData({
      tanggal: renungan.tanggal,
      ayat: renungan.ayat,
      teks: renungan.teks,
      refleksi: renungan.refleksi,
      kategori: renungan.kategori,
    });
    setModalOpen(true);
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#374151]">Memuat...</div>
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
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-[#374151]">Kelola Renungan Harian</CardTitle>
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                  >
                    <Plus size={16} className="mr-1" />
                    Tambah Renungan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Daftar Renungan */}
                <div className="space-y-4">
                  {renungans.map((renungan) => (
                    <Card key={renungan.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-bold text-[#374151]">{renungan.ayat}</h3>
                              <span className="bg-[#FEF9C3] text-[#374151] text-xs px-2 py-1 rounded-full">
                                {renungan.kategori}
                              </span>
                            </div>
                            <p className="text-sm text-[#6B7280] mt-1">
                              {new Date(renungan.tanggal).toLocaleDateString('id-ID')}
                            </p>
                            <p className="text-[#374151] mt-2 italic">"{renungan.teks}"</p>
                            <p className="text-[#6B7280] mt-2">{renungan.refleksi}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(renungan)}
                              className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(renungan.id)}
                              className="border-[#FDE68A] text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {renungans.length === 0 && (
                  <div className="text-center py-12 text-[#6B7280]">
                    <Heart size={48} className="mx-auto mb-4 text-[#FACC15]" />
                    <p>Belum ada renungan harian.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit Renungan */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#374151]">
                {editing ? 'Edit Renungan' : 'Tambah Renungan Baru'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="tanggal" className="text-[#374151]">
                    Tanggal <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <Input
                      id="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => handleChange('tanggal', e.target.value)}
                      className={`pl-10 border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.tanggal ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.tanggal && <p className="text-red-500 text-sm">{errors.tanggal}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ayat" className="text-[#374151]">
                    Ayat Alkitab <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ayat"
                    value={formData.ayat}
                    onChange={(e) => handleChange('ayat', e.target.value)}
                    placeholder="Contoh: Yeremia 29:11"
                    className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.ayat ? 'border-red-500' : ''}`}
                  />
                  {errors.ayat && <p className="text-red-500 text-sm">{errors.ayat}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teks" className="text-[#374151]">
                    Teks Ayat <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="teks"
                    value={formData.teks}
                    onChange={(e) => handleChange('teks', e.target.value)}
                    placeholder="Tuliskan teks ayat..."
                    rows={3}
                    className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.teks ? 'border-red-500' : ''}`}
                  />
                  {errors.teks && <p className="text-red-500 text-sm">{errors.teks}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refleksi" className="text-[#374151]">
                    Refleksi <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="refleksi"
                    value={formData.refleksi}
                    onChange={(e) => handleChange('refleksi', e.target.value)}
                    placeholder="Tuliskan renungan/refleksi dari ayat ini..."
                    rows={4}
                    className={`border-[#FDE68A] focus-visible:ring-[#FACC15] ${errors.refleksi ? 'border-red-500' : ''}`}
                  />
                  {errors.refleksi && <p className="text-red-500 text-sm">{errors.refleksi}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kategori" className="text-[#374151]">Kategori</Label>
                  <Select
                    value={formData.kategori}
                    onValueChange={(value) => handleChange('kategori', value)}
                  >
                    <SelectTrigger className="border-[#FDE68A] focus:ring-[#FACC15]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {kategoris.map((kat) => (
                        <SelectItem key={kat} value={kat}>
                          {kat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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