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
            ->select('id', 'judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe', 'gambar', 'gambar_public_id', 'user_id', 'created_at')
            ->latest()
            ->get();

        // --- DEBUG LOG ---
        \Log::info('Kegiatans Data for Index:', $kegiatans->toArray());
        // -----------------

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
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe']);

        // ✅ Tambahkan user_id dari user yang sedang login
        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('gambar')) {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

            $file = $request->file('gambar');
            $fileName = $file->getClientOriginalName();

            // ✅ FIX: HAPUS SPASI BERLEBIH DI URL
            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $fileName
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'cover-kegiatan',
            ]);

            if ($response->successful()) {
                $uploadResult = $response->json();
                $data['gambar'] = $uploadResult['secure_url'];
                $data['gambar_public_id'] = $uploadResult['public_id'];
            } else {
                Log::error('Cloudinary upload failed', $response->json());
                return response()->json(['message' => 'Gagal upload gambar'], 500);
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
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe']);

        if ($request->hasFile('gambar')) {
            if ($kegiatan->gambar_public_id) {
                $this->deleteOldImageFromCloudinary($kegiatan->gambar_public_id);
            }

            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');
            $file = $request->file('gambar');

            // ✅ FIX: HAPUS SPASI BERLEBIH DI URL
            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'cover-kegiatan',
            ]);

            if ($response->successful()) {
                $uploadResult = $response->json();
                $data['gambar'] = $uploadResult['secure_url'];
                $data['gambar_public_id'] = $uploadResult['public_id'];
            } else {
                Log::error('Cloudinary upload failed', $response->json());
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
                'success' => $response->successful()
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Failed to delete image from Cloudinary: ' . $e->getMessage());
            return false;
        }
    }

    // ✅ TAMBAHAN: Method untuk menyelesaikan kegiatan secara manual
    public function selesaikan(Kegiatan $kegiatan)
    {
        if ($kegiatan->tipe !== 'agenda') {
            return response()->json(['message' => 'Hanya agenda yang bisa diselesaikan'], 400);
        }

        $kegiatan->update(['tipe' => 'laporan']);

        return response()->json($kegiatan);
    }

    // ✅ TAMBAHAN: Method untuk melihat daftar peserta suatu kegiatan
    public function peserta(Kegiatan $kegiatan)
    {
        \Log::info('Fetching peserta for kegiatan ID: ' . $kegiatan->id);

        $peserta = $kegiatan->peserta()->get(['users.id', 'full_name', 'email', 'school', 'grade', 'major']);

        \Log::info('Peserta fetched:', $peserta->toArray());

        return response()->json($peserta);
    }
}