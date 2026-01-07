<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PesertaKegiatanController extends Controller
{
    public function daftar(Request $request, Kegiatan $kegiatan)
    {
        $user = Auth::user();

        // ✅ Tambahkan validasi: hanya agenda yang bisa didaftar
        if ($kegiatan->tipe !== 'agenda') {
            return response()->json(['message' => 'Tidak bisa mendaftar ke kegiatan ini.'], 400);
        }

        // ✅ Tambahkan validasi: pastikan kegiatan belum lewat
        if ($kegiatan->tanggal_mulai < now()->toDateString()) {
            return response()->json(['message' => 'Kegiatan ini sudah lewat.'], 400);
        }

        // Cek apakah sudah mendaftar
        if ($kegiatan->peserta()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Anda sudah terdaftar di kegiatan ini.'], 400);
        }

        $kegiatan->peserta()->attach($user->id);

        return response()->json(['message' => 'Berhasil mendaftar ke kegiatan.']);
    }

    public function batalDaftar(Kegiatan $kegiatan)
    {
        $user = Auth::user();

        // ✅ Tambahkan validasi: hanya agenda yang bisa dibatalkan pendaftarannya
        if ($kegiatan->tipe !== 'agenda') {
            return response()->json(['message' => 'Tidak bisa membatalkan pendaftaran ke kegiatan ini.'], 400);
        }

        $kegiatan->peserta()->detach($user->id);

        return response()->json(['message' => 'Berhasil membatalkan pendaftaran dari kegiatan.']);
    }

    public function cekStatus(Kegiatan $kegiatan)
    {
        $user = Auth::user();

        // ✅ Tambahkan validasi: hanya agenda yang bisa dicek statusnya
        if ($kegiatan->tipe !== 'agenda') {
            return response()->json(['is_peserta' => false]);
        }

        $isPeserta = $kegiatan->peserta()->where('user_id', $user->id)->exists();

        return response()->json(['is_peserta' => $isPeserta]);
    }
}