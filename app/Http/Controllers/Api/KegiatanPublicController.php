<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;

class KegiatanPublicController extends Controller
{
    /**
     * Menampilkan daftar kegiatan untuk user (hanya yang relevan).
     * Termasuk jumlah peserta masing-masing kegiatan.
     */
    public function index()
    {
        $kegiatans = Kegiatan::withCount('peserta') // Tambahkan jumlah peserta
            ->forPublic()
            ->latest()
            ->get();

        return response()->json($kegiatans);
    }

    /**
     * Menampilkan detail satu kegiatan.
     * Termasuk jumlah peserta.
     */
    public function show($id)
    {
        $kegiatan = Kegiatan::withCount('peserta')->find($id); // Tambahkan jumlah peserta
        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }
        return response()->json($kegiatan);
    }
}