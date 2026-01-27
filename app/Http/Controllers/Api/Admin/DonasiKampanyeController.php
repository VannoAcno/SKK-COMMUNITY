<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\DonasiKampanye; // Pastikan model ini diimpor
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http; // Tambahkan ini untuk Cloudinary

class DonasiKampanyeController extends Controller
{
    /**
     * Display a listing of the resource.
     * Endpoint: GET /api/admin/donasi-kampanye
     */
    public function index()
    {
        $kampanyes = DonasiKampanye::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar kampanye donasi berhasil diambil.',
            'data' => $kampanyes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Endpoint: POST /api/admin/donasi-kampanye
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'target' => 'required|integer|min:1000',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validasi gambar
            'is_active' => 'boolean', // Opsional: defaultnya bisa true
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'target']);
        $data['is_active'] = $request->has('is_active') ? $request->is_active : true; // Default true jika tidak diset

        // Proses upload gambar ke Cloudinary
        if ($request->hasFile('gambar')) {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');
            $file = $request->file('gambar');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $fileName
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'cover-kampanye', // Folder di Cloudinary
            ]);

            if ($response->successful()) {
                $uploadResult = $response->json();
                $data['gambar'] = $uploadResult['secure_url'];
                // Jika Anda ingin menyimpan public_id juga
                // $data['gambar_public_id'] = $uploadResult['public_id'];
            } else {
                Log::error('Cloudinary upload failed for gambar kampanye', $response->json());
                return response()->json(['message' => 'Gagal upload gambar'], 500);
            }
        }

        try {
            $kampanye = DonasiKampanye::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Kampanye donasi berhasil dibuat.',
                'data' => $kampanye->only(['id', 'judul', 'deskripsi', 'target', 'gambar', 'is_active', 'created_at']),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Gagal menyimpan kampanye donasi: ' . $e->getMessage());

            // Hapus file dari Cloudinary jika gagal menyimpan ke database
            if (isset($data['gambar'])) {
                $publicId = basename(parse_url($data['gambar'], PHP_URL_PATH));
                $this->deleteImageFromCloudinary($publicId);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan kampanye donasi.',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * Endpoint: GET /api/admin/donasi-kampanye/{id}
     */
    public function show($id) // $id adalah ID kampanye dari URL
    {
        try {
            $kampanye = DonasiKampanye::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Detail kampanye berhasil diambil.',
                'data' => $kampanye,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Gagal mengambil detail kampanye donasi: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Kampanye donasi tidak ditemukan.',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     * Endpoint: PUT/PATCH /api/admin/donasi-kampanye/{id}
     */
    public function update(Request $request, DonasiKampanye $donasiKampanye) // Gunakan route model binding
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'sometimes|required|string|max:255',
            'deskripsi' => 'sometimes|required|string',
            'target' => 'sometimes|required|integer|min:1000',
            'gambar' => 'sometimes|required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'target', 'is_active']);
        $oldImageUrl = $donasiKampanye->gambar; // Simpan URL gambar lama

        // Proses upload gambar baru ke Cloudinary (jika ada)
        if ($request->hasFile('gambar')) {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');
            $file = $request->file('gambar');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $fileName
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'cover-kampanye',
            ]);

            if ($response->successful()) {
                $uploadResult = $response->json();
                $data['gambar'] = $uploadResult['secure_url'];
                // Jika Anda menyimpan public_id, hapus yang lama dan simpan yang baru
                /*
                if ($donasiKampanye->gambar_public_id) {
                    $this->deleteImageFromCloudinary($donasiKampanye->gambar_public_id);
                }
                $data['gambar_public_id'] = $uploadResult['public_id'];
                */
            } else {
                Log::error('Cloudinary upload failed for updated gambar kampanye', $response->json());
                return response()->json(['message' => 'Gagal upload gambar baru'], 500);
            }
        }

        try {
            $donasiKampanye->update($data);

            // Hapus gambar lama dari Cloudinary jika gambar diganti
            if ($request->hasFile('gambar') && $oldImageUrl) {
                $publicId = basename(parse_url($oldImageUrl, PHP_URL_PATH));
                $this->deleteImageFromCloudinary($publicId);
            }

            return response()->json([
                'success' => true,
                'message' => 'Kampanye donasi berhasil diperbarui.',
                'data' => $donasiKampanye->fresh()->only(['id', 'judul', 'deskripsi', 'target', 'gambar', 'is_active', 'updated_at']),
            ]);

        } catch (\Exception $e) {
            Log::error('Gagal mengupdate kampanye donasi: ' . $e->getMessage());

            // Jika gagal update, hapus gambar baru yang diupload
            if ($request->hasFile('gambar') && isset($data['gambar'])) {
                $publicId = basename(parse_url($data['gambar'], PHP_URL_PATH));
                $this->deleteImageFromCloudinary($publicId);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate kampanye donasi.',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Endpoint: DELETE /api/admin/donasi-kampanye/{id}
     */
    public function destroy(DonasiKampanye $donasiKampanye) // Gunakan route model binding
    {
        $imageUrl = $donasiKampanye->gambar; // Simpan URL gambar sebelum dihapus

        try {
            $donasiKampanye->delete();

            // Hapus gambar dari Cloudinary setelah record dihapus
            if ($imageUrl) {
                $publicId = basename(parse_url($imageUrl, PHP_URL_PATH));
                $this->deleteImageFromCloudinary($publicId);
            }

            return response()->json([
                'success' => true,
                'message' => 'Kampanye donasi berhasil dihapus.',
            ]);

        } catch (\Exception $e) {
            Log::error('Gagal menghapus kampanye donasi: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus kampanye donasi.',
            ], 500);
        }
    }

    // Fungsi bantuan untuk menghapus gambar dari Cloudinary
    private function deleteImageFromCloudinary($publicId)
    {
        try {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $apiKey = env('CLOUDINARY_API_KEY');
            $apiSecret = env('CLOUDINARY_API_SECRET');
            $timestamp = time();

            $signature = sha1("public_id={$publicId}&timestamp={$timestamp}{$apiSecret}");

            $response = Http::asForm()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                'public_id' => $publicId,
                'signature' => $signature,
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
            ]);

            Log::info('Deleted image from Cloudinary', [
                'public_id' => $publicId,
                'success' => $response->successful()
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Failed to delete image from Cloudinary: ' . $e->getMessage());
            return false;
        }
    }
}