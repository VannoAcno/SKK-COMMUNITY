<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KegiatanController extends Controller
{
    public function index()
    {
        try {
            $kegiatans = Kegiatan::with(['user:id,full_name,avatar'])
                ->select('id', 'judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe', 'gambar', 'gambar_public_id', 'user_id', 'is_active', 'created_at')
                ->latest()
                ->get();

            return response()->json($kegiatans);
        } catch (\Exception $e) {
            Log::error('Failed to fetch kegiatans: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengambil data kegiatan'], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'nullable|string|max:255',
            'tipe' => 'required|in:agenda,laporan',
            'is_active' => 'sometimes|boolean',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe', 'is_active']);
        $data['user_id'] = $request->user()->id;
        $data['is_active'] = $request->has('is_active') ? (bool) $request->input('is_active') : true;

        if ($request->hasFile('gambar')) {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

            if (!$cloudName || !$uploadPreset) {
                Log::error('Cloudinary credentials missing in .env');
                return response()->json(['message' => 'Konfigurasi Cloudinary tidak lengkap'], 500);
            }

            $file = $request->file('gambar');
            $fileName = $file->getClientOriginalName();

            // ✅ FIX: HAPUS SPASI BERLEBIH DI URL
            $response = Http::attach(
                'file',
                file_get_contents($file->getRealPath()),
                $fileName
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'cover-kegiatan',
            ]);

            if ($response->successful()) {
                $uploadResult = $response->json();
                \Log::info('Cloudinary Upload Success', [
                    'public_id' => $uploadResult['public_id'],
                    'secure_url' => $uploadResult['secure_url'],
                ]);
                $data['gambar'] = $uploadResult['secure_url'];
                $data['gambar_public_id'] = $uploadResult['public_id'];
            } else {
                Log::error('Cloudinary upload failed', $response->json());
                return response()->json(['message' => 'Gagal upload gambar ke Cloudinary'], 500);
            }
        }

        try {
            $kegiatan = Kegiatan::create($data);
            return response()->json($kegiatan, 201);
        } catch (\Exception $e) {
            Log::error('Failed to create kegiatan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menambahkan kegiatan'], 500);
        }
    }

    public function show(Kegiatan $kegiatan)
    {
        return response()->json($kegiatan);
    }

    public function update(Request $request, Kegiatan $kegiatan)
{
    $validator = Validator::make($request->all(), [
        'judul' => 'required|string|max:255',
        'deskripsi' => 'nullable|string',
        'tanggal_mulai' => 'required|date',
        'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        'lokasi' => 'nullable|string|max:255',
        'tipe' => 'required|in:agenda,laporan',
        'is_active' => 'nullable|boolean',
        'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // ✅ SOLUSI LANGSUNG: Set data tanpa is_active dulu
    $data = $request->only(['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe']);
    
    // ✅ SOLUSI LANGSUNG: Konversi is_active ke 0/1
    $data['is_active'] = $request->input('is_active') == '1' ? 1 : 0;

    if ($request->hasFile('gambar')) {
        if ($kegiatan->gambar_public_id) {
            $this->deleteOldImageFromCloudinary($kegiatan->gambar_public_id);
        }

        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

        if (!$cloudName || !$uploadPreset) {
            Log::error('Cloudinary credentials missing in .env');
            return response()->json(['message' => 'Konfigurasi Cloudinary tidak lengkap'], 500);
        }

        $file = $request->file('gambar');

        $response = Http::attach(
            'file',
            file_get_contents($file->getRealPath()),
            $file->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
            'upload_preset' => $uploadPreset,
            'folder' => 'cover-kegiatan',
        ]);

        if ($response->successful()) {
            $uploadResult = $response->json();
            $data['gambar'] = $uploadResult['secure_url'];
            $data['gambar_public_id'] = $uploadResult['public_id'];
        } else {
            Log::error('Cloudinary upload failed during update', $response->json());
            return response()->json(['message' => 'Gagal upload gambar baru'], 500);
        }
    }

    try {
        $kegiatan->update($data);
        return response()->json($kegiatan);
    } catch (\Exception $e) {
        Log::error('Failed to update kegiatan: ' . $e->getMessage());
        return response()->json(['message' => 'Gagal memperbarui kegiatan'], 500);
    }
}

    public function destroy(Kegiatan $kegiatan)
    {
        try {
            if ($kegiatan->gambar_public_id) {
                $this->deleteOldImageFromCloudinary($kegiatan->gambar_public_id);
            }

            $kegiatan->delete();
            return response()->json(['message' => 'Kegiatan berhasil dihapus'], 204);
        } catch (\Exception $e) {
            Log::error('Failed to delete kegiatan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menghapus kegiatan'], 500);
        }
    }

    private function deleteOldImageFromCloudinary($publicId)
    {
        try {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $apiKey = env('CLOUDINARY_API_KEY');
            $apiSecret = env('CLOUDINARY_API_SECRET');

            if (!$cloudName || !$apiKey || !$apiSecret) {
                Log::warning('Cloudinary API credentials missing — skipping image deletion');
                return false;
            }

            $timestamp = time();
            $signature = sha1("public_id={$publicId}&timestamp={$timestamp}{$apiSecret}");

            // ✅ FIX: HAPUS SPASI BERLEBIH DI URL
            $response = Http::asForm()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                'public_id' => $publicId,
                'signature' => $signature,
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
            ]);

            Log::info('Deleted old image from Cloudinary', [
                'public_id' => $publicId,
                'success' => $response->successful(),
                'response' => $response->json(),
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Failed to delete image from Cloudinary: ' . $e->getMessage());
            return false;
        }
    }

    // ✅ FUNGSI SELESAIKAN YANG DIPERBAIKI
    public function selesaikan(Kegiatan $kegiatan)
    {
        if ($kegiatan->tipe !== 'agenda') {
            return response()->json(['message' => 'Hanya agenda yang bisa diselesaikan'], 400);
        }

        if (!$kegiatan->is_active) {
            return response()->json(['message' => 'Kegiatan ini sudah diselesaikan'], 400);
        }

        // ✅ HANYA UBAH STATUS is_active MENJADI false, TIDAK MENGUBAH TIPE
        $kegiatan->update(['is_active' => false]);
        
        return response()->json($kegiatan);
    }

    public function peserta(Kegiatan $kegiatan)
    {
        $peserta = $kegiatan->peserta()->get(['users.id', 'full_name', 'email', 'school', 'grade', 'major']);
        return response()->json($peserta);
    }
}