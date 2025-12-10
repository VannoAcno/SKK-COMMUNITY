// resources/js/pages/admin/KegiatanAdmin.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "@/components/shared/AdminSidebar";
import Footer from "@/components/shared/Footer";

export default function KegiatanAdmin() {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();
    const [kegiatans, setKegiatans] = useState([
        {
            id: 1,
            judul: "Retret Pemuda 2025",
            deskripsi:
                "Menghadirkan suasana rohani yang menyegarkan untuk pemuda.",
            tanggal_mulai: "2025-02-15",
            tanggal_selesai: "2025-02-17",
            lokasi: "Villa Bukit Berbunga, Batu",
            tipe: "agenda",
            gambar: "https://placehold.co/400x200/FACC15/white?text=Retret+Pemuda",
        },
        {
            id: 2,
            judul: "Bakti Sosial SKK",
            deskripsi: "Membantu korban banjir di wilayah Surabaya Timur.",
            tanggal_mulai: "2025-03-22",
            tanggal_selesai: "2025-03-22",
            lokasi: "Panti Asuhan Kasih Bunda",
            tipe: "agenda",
            gambar: "https://placehold.co/400x200/10B981/white?text=Bakti+Sosial",
        },
        {
            id: 3,
            judul: "Laporan Kegiatan Januari",
            deskripsi: "Ringkasan kegiatan SKK bulan Januari 2025.",
            tanggal_mulai: "2025-01-31",
            tanggal_selesai: null,
            lokasi: "-",
            tipe: "laporan",
            gambar: "https://placehold.co/400x200/8B5CF6/white?text=Laporan+Kegiatan",
        },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        lokasi: "",
        tipe: "agenda",
    });

    const [errors, setErrors] = useState({});

    // Load admin dari localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (!userData.id || !userData.is_admin) {
            navigate("/home");
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
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSave = () => {
        const newErrors = {};
        if (!formData.judul.trim()) newErrors.judul = "Judul wajib diisi.";
        if (!formData.tanggal_mulai)
            newErrors.tanggal_mulai = "Tanggal mulai wajib diisi.";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (editing) {
            setKegiatans(
                kegiatans.map((k) =>
                    k.id === editing.id ? { ...formData, id: editing.id } : k
                )
            );
        } else {
            const newKegiatan = {
                ...formData,
                id: Date.now(),
                gambar:
                    formData.gambar ||
                    "https://placehold.co/400x200/FACC15/white?text=" +
                        encodeURIComponent(formData.judul.substring(0, 15)),
            };
            setKegiatans([newKegiatan, ...kegiatans]);
        }

        setModalOpen(false);
        setEditing(null);
        setFormData({
            judul: "",
            deskripsi: "",
            tanggal_mulai: "",
            tanggal_selesai: "",
            lokasi: "",
            tipe: "agenda",
        });
        setErrors({});
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Kegiatan ini akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FACC15",
            cancelButtonColor: "#d1d5db",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                setKegiatans(kegiatans.filter((k) => k.id !== id));
                Swal.fire("Berhasil!", "Kegiatan dihapus.", "success");
            }
        });
    };

    const openEditModal = (kegiatan) => {
        setEditing(kegiatan);
        setFormData({
            judul: kegiatan.judul,
            deskripsi: kegiatan.deskripsi,
            tanggal_mulai: kegiatan.tanggal_mulai,
            tanggal_selesai: kegiatan.tanggal_selesai || "",
            lokasi: kegiatan.lokasi,
            tipe: kegiatan.tipe,
        });
        setModalOpen(true);
    };

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
                                <CardContent className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h1 className="text-2xl font-bold text-[#374151]">
                                                Kelola Kegiatan
                                            </h1>
                                            <p className="text-[#6B7280]">
                                                Daftar kegiatan SKK Community.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => setModalOpen(true)}
                                            className="bg-[#FACC15] text-black hover:bg-[#EAB308] font-semibold"
                                        >
                                            <Plus size={16} className="mr-1" />
                                            Tambah Kegiatan
                                        </Button>
                                    </div>

                                    {/* Daftar Kegiatan */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {kegiatans.map((kegiatan) => (
                                            <Card
                                                key={kegiatan.id}
                                                className="border-0 shadow-sm"
                                            >
                                                <CardContent className="p-4">
                                                    {kegiatan.gambar && (
                                                        <img
                                                            src={
                                                                kegiatan.gambar
                                                            }
                                                            alt={kegiatan.judul}
                                                            className="w-full h-32 object-cover rounded-md mb-3"
                                                        />
                                                    )}
                                                    <h3 className="font-bold text-[#374151]">
                                                        {kegiatan.judul}
                                                    </h3>
                                                    <p className="text-sm text-[#6B7280] mt-1">
                                                        {kegiatan.lokasi}
                                                    </p>
                                                    <p className="text-xs text-[#6B7280]">
                                                        {new Date(
                                                            kegiatan.tanggal_mulai
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}{" "}
                                                        →{" "}
                                                        {kegiatan.tanggal_selesai
                                                            ? new Date(
                                                                  kegiatan.tanggal_selesai
                                                              ).toLocaleDateString(
                                                                  "id-ID"
                                                              )
                                                            : "Belum selesai"}
                                                    </p>
                                                    <div className="flex gap-2 mt-4">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    kegiatan
                                                                )
                                                            }
                                                            className="border-[#FDE68A] text-[#374151] hover:bg-[#FEF9C3]"
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    kegiatan.id
                                                                )
                                                            }
                                                            className="border-[#FDE68A] text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
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
                                    {editing
                                        ? "Edit Kegiatan"
                                        : "Tambah Kegiatan Baru"}
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
                                        <Label
                                            htmlFor="judul"
                                            className="text-[#374151]"
                                        >
                                            Judul{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="judul"
                                            value={formData.judul}
                                            onChange={(e) =>
                                                handleChange(
                                                    "judul",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: Retret Pemuda 2025"
                                            className={
                                                errors.judul
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.judul && (
                                            <p className="text-red-500 text-sm">
                                                {errors.judul}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="deskripsi"
                                            className="text-[#374151]"
                                        >
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="deskripsi"
                                            value={formData.deskripsi}
                                            onChange={(e) =>
                                                handleChange(
                                                    "deskripsi",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Deskripsikan kegiatan..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="tanggal_mulai"
                                                className="text-[#374151]"
                                            >
                                                Tanggal Mulai{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <Calendar
                                                    size={16}
                                                    className="absolute left-3 top-3 text-[#6B7280]"
                                                />
                                                <Input
                                                    id="tanggal_mulai"
                                                    type="date"
                                                    value={
                                                        formData.tanggal_mulai
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "tanggal_mulai",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 ${
                                                        errors.tanggal_mulai
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                />
                                            </div>
                                            {errors.tanggal_mulai && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.tanggal_mulai}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="tanggal_selesai"
                                                className="text-[#374151]"
                                            >
                                                Tanggal Selesai
                                            </Label>
                                            <div className="relative">
                                                <Calendar
                                                    size={16}
                                                    className="absolute left-3 top-3 text-[#6B7280]"
                                                />
                                                <Input
                                                    id="tanggal_selesai"
                                                    type="date"
                                                    value={
                                                        formData.tanggal_selesai
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "tanggal_selesai",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="lokasi"
                                            className="text-[#374151]"
                                        >
                                            Lokasi
                                        </Label>
                                        <Input
                                            id="lokasi"
                                            value={formData.lokasi}
                                            onChange={(e) =>
                                                handleChange(
                                                    "lokasi",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: Villa Bukit Berbunga, Batu"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="tipe"
                                            className="text-[#374151]"
                                        >
                                            Tipe
                                        </Label>
                                        <Select
                                            value={formData.tipe}
                                            onValueChange={(v) =>
                                                handleChange("tipe", v)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="agenda">
                                                    Agenda (Akan Datang)
                                                </SelectItem>
                                                <SelectItem value="laporan">
                                                    Laporan (Sudah Lewat)
                                                </SelectItem>
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
                                            {editing ? "Perbarui" : "Simpan"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
            <Footer/>
        </>
    );
}
