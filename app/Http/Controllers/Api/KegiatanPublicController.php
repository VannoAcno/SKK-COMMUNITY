<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;

class KegiatanPublicController extends Controller
{
    public function index()
    {
        $kegiatans = Kegiatan::withCount('peserta')
            ->forPublic()
            ->orderBy('tanggal_mulai', 'desc') // 🟢 Urut dari tanggal terbesar ke terkecil
            ->get();

        return response()->json($kegiatans);
    }

    public function show($id)
    {
        $kegiatan = Kegiatan::withCount('peserta')->find($id);
        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }
        return response()->json($kegiatan);
    }
}