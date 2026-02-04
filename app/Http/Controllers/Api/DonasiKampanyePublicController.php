<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonasiKampanye;
use App\Models\Donasi;
use Illuminate\Http\Request;

class DonasiKampanyePublicController extends Controller
{
    /**
     * Display a listing of active campaigns.
     * Endpoint: GET /api/donasi-kampanyes-aktif
     */
    public function index()
    {
        try {
            $kampanyes = DonasiKampanye::where('is_active', true)
                ->withCount(['donasis as donasi_success_count' => function ($query) {
                    $query->where('status', 'success');
                }])
                ->withSum(['donasis as total_terkumpul' => function ($query) {
                    $query->where('status', 'success');
                }], 'nominal')
                ->orderBy('created_at', 'desc')
                ->get();

            // Format data untuk response
            $formattedKampanyes = $kampanyes->map(function ($kampanye) {
                return [
                    'id' => $kampanye->id,
                    'judul' => $kampanye->judul,
                    'deskripsi' => $kampanye->deskripsi,
                    'target' => $kampanye->target,
                    'gambar' => $kampanye->gambar,
                    'is_active' => $kampanye->is_active,
                    'jumlah_donatur' => $kampanye->donasi_success_count,
                    'total_terkumpul' => $kampanye->total_terkumpul ?? 0,
                    'created_at' => $kampanye->created_at,
                    'updated_at' => $kampanye->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Daftar kampanye donasi aktif berhasil diambil.',
                'data' => $formattedKampanyes,
            ]);
        } catch (\Exception $e) {
            \Log::error('Gagal mengambil kampanye donasi publik: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil daftar kampanye donasi.',
            ], 500);
        }
    }

    /**
     * Display the specified resource (kampanye detail).
     * Endpoint: GET /api/donasi-kampanyes/{id}
     */
    public function show($id)
    {
        try {
            $kampanye = DonasiKampanye::withCount(['donasis as donasi_success_count' => function ($query) {
                    $query->where('status', 'success');
                }])
                ->withSum(['donasis as total_terkumpul' => function ($query) {
                    $query->where('status', 'success');
                }], 'nominal')
                ->findOrFail($id);

            // ✅ PERBAIKAN: TIDAK MENGEMBALIKAN 404 UNTUK KAMPANYE TIDAK AKTIF
            // Biarkan frontend yang menentukan apakah kampanye bisa didonasi atau tidak

            $responseData = [
                'id' => $kampanye->id,
                'judul' => $kampanye->judul,
                'deskripsi' => $kampanye->deskripsi,
                'target' => $kampanye->target,
                'gambar' => $kampanye->gambar,
                'is_active' => $kampanye->is_active, // ✅ Tetap kirim status
                'jumlah_donatur' => $kampanye->donasi_success_count,
                'total_terkumpul' => $kampanye->total_terkumpul ?? 0,
                'created_at' => $kampanye->created_at,
                'updated_at' => $kampanye->updated_at,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Detail kampanye donasi berhasil diambil.',
                'data' => $responseData, // ✅ Format respons yang benar
            ]);
        } catch (\Exception $e) {
            \Log::error('Gagal mengambil detail kampanye publik: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Kampanye tidak ditemukan.',
            ], 404);
        }
    }
}