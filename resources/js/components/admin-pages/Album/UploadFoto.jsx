// resources/js/components/admin-pages/Album/UploadFotoPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera, X, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function UploadFoto() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    deskripsi_umum: '',
  });

  const [files, setFiles] = useState([]); // List file yang dipilih
  const [fileDetails, setFileDetails] = useState({}); // Judul dan deskripsi per file
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validasi ukuran file (max 2MB)
    const oversizedFiles = selectedFiles.filter(file => file.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      // alert('Beberapa file terlalu besar. Max 2MB per file.'); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'File terlalu besar',
        text: 'Max 2MB per file. File berikut terlalu besar: ' + oversizedFiles.map(f => f.name).join(', '),
        confirmButtonColor: '#FACC15',
      });
      return;
    }

    // Tambahkan file baru ke list
    const newFiles = selectedFiles.filter(file => !files.some(f => f.name === file.name));
    setFiles(prev => [...prev, ...newFiles]);

    // Inisialisasi judul dan deskripsi untuk file baru
    newFiles.forEach(file => {
      setFileDetails(prev => ({
        ...prev,
        [file.name]: {
          judul: file.name.split('.')[0], // Nama file tanpa ekstensi sebagai judul default
          deskripsi: ''
        }
      }));
    });
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
    setFileDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[fileName];
      return newDetails;
    });
  };

  const handleFileDetailChange = (fileName, field, value) => {
    setFileDetails(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (files.length === 0) newErrors.files = ['Minimal 1 file harus diupload.'];
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      // Upload file satu per satu
      const uploadPromises = files.map(async (file) => {
        const detail = fileDetails[file.name];

        const apiData = new FormData();
        apiData.append('judul', detail.judul || file.name.split('.')[0]);
        apiData.append('deskripsi', detail.deskripsi || formData.deskripsi_umum);
        apiData.append('gambar', file);

        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/admin/albums/${albumId}/fotos`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: apiData,
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(`Gagal upload ${file.name}: ${result.message || 'Server error'}`);
        }

        return result;
      });

      const results = await Promise.all(uploadPromises);

      // alert(`${results.length} foto berhasil ditambahkan.`); // ❌ GANTI INI
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${results.length} foto berhasil ditambahkan.`,
        confirmButtonColor: '#FACC15',
      });

      // Redirect ke halaman detail album
      navigate(`/admin/albums/${albumId}`);

    } catch (err) {
      // alert(`Gagal upload foto: ${err.message}`); // ❌ GANTI INI
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat upload foto.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]"> {/* Ganti warna latar belakang */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="w-64">
              <AdminSidebar admin={JSON.parse(localStorage.getItem('user') || '{}')} />
            </div>
            <div className="flex-1">
              <Card className="border-0 shadow-lg bg-white"> {/* Gaya card */}
                <CardHeader>
                  <CardTitle className="text-2xl text-[#374151] font-bold">Upload Foto ke Album</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Deskripsi Umum */}
                    <div className="space-y-2">
                      <Label htmlFor="deskripsi_umum" className="text-[#374151]">
                        Deskripsi Umum (Opsional)
                      </Label>
                      <Textarea
                        id="deskripsi_umum"
                        value={formData.deskripsi_umum}
                        onChange={(e) => setFormData(prev => ({ ...prev, deskripsi_umum: e.target.value }))}
                        placeholder="Deskripsi yang akan digunakan untuk semua foto (bisa ditimpa per file)"
                        rows={2}
                        className="border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0" // Gaya textarea
                      />
                    </div>

                    {/* Upload File */}
                    <div className="space-y-2">
                      <Label htmlFor="gambar" className="text-[#374151]">
                        Upload Foto <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative border-2 border-dashed border-[#FDE68A] rounded-lg p-8 text-center cursor-pointer group bg-[#FEF9C3]/30"> {/* Gaya container upload */}
                        <input
                          id="gambar"
                          type="file"
                          accept="image/*"
                          multiple // ✅ Multi upload
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                          <Plus size={48} className="text-[#FACC15] mb-2 group-hover:text-[#EAB308]" />
                          <p className="text-sm text-[#6B7280]">
                            Klik untuk pilih foto atau drag & drop
                          </p>
                          <p className="text-xs text-[#6B7280]/70 mt-1">Max 2MB per file, JPG/PNG</p>
                        </div>
                      </div>
                      {errors.files && <p className="text-red-500 text-sm">{errors.files[0]}</p>}
                    </div>

                    {/* Preview Files */}
                    {files.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#374151]">Daftar Foto ({files.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {files.map((file, index) => (
                            <Card key={file.name} className="border-0 shadow-sm bg-white border border-[#FEF9C3]"> {/* Gaya card file */}
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-[#374151] truncate">{file.name}</div>
                                    <div className="text-xs text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(file.name)}
                                    className="text-red-500 hover:text-red-700 p-0 h-auto" // Gaya button hapus
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>

                                {/* Judul per file */}
                                <div className="space-y-2">
                                  <Label className="text-xs text-[#6B7280]">Judul Foto</Label>
                                  <Input
                                    value={fileDetails[file.name]?.judul || ''}
                                    onChange={(e) => handleFileDetailChange(file.name, 'judul', e.target.value)}
                                    placeholder="Judul foto..."
                                    className="text-sm border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0" // Gaya input
                                  />
                                </div>

                                {/* Deskripsi per file */}
                                <div className="space-y-2 mt-2">
                                  <Label className="text-xs text-[#6B7280]">Deskripsi (Opsional)</Label>
                                  <Textarea
                                    value={fileDetails[file.name]?.deskripsi || ''}
                                    onChange={(e) => handleFileDetailChange(file.name, 'deskripsi', e.target.value)}
                                    placeholder="Deskripsi foto..."
                                    rows={2}
                                    className="text-sm border-[#FDE68A] focus-visible:ring-[#FACC15] focus-visible:ring-offset-0" // Gaya textarea
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
                        className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]" // Gaya button
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || files.length === 0}
                        className="bg-[#FACC15] hover:bg-[#e0b70a] text-black font-semibold shadow-md hover:shadow-lg transition-shadow" // Gaya button
                      >
                        {loading ? 'Mengupload...' : `Upload ${files.length} Foto`}
                      </Button>
                    </div>
                  </form>
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