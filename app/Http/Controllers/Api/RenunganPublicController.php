<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Renungan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RenunganPublicController extends Controller
{
    public function renunganHarian()
    {
        try {
            // Ambil renungan hari ini
            $renungan = Renungan::whereDate('tanggal', today())->first();

            if (!$renungan) {
                // Jika tidak ada renungan hari ini, ambil renungan terbaru
                $renungan = Renungan::orderBy('tanggal', 'desc')->first();
            }

            if (!$renungan) {
                // Jika tidak ada sama sekali
                return response()->json([
                    'tanggal' => now()->locale('id_ID')->isoFormat('dddd, D MMMM YYYY'),
                    'judul' => 'Tidak ada renungan hari ini',
                    'isi' => 'Tuhan selalu menyertaimu dalam setiap langkahmu.',
                    'kategori' => 'Harapan'
                ], 200);
            }

            return response()->json([
                'tanggal' => $renungan->tanggal->locale('id_ID')->isoFormat('dddd, D MMMM YYYY'),
                'judul' => $renungan->judul,
                'isi' => $renungan->isi,
                'kategori' => $renungan->kategori
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch renungan harian: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal mengambil renungan harian'
            ], 500);
        }
    }
}