<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AlbumController extends Controller
{
    public function index()
    {
        $albums = Album::withCount('fotos')->latest()->get();
        return response()->json($albums);
    }

    public function show(Album $album)
    {
        $album->load([
            'fotos.user:id,full_name',
            'user:id,full_name'
        ]);
        return response()->json($album);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_pembuatan' => 'nullable|date',
            'gambar_cover' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'tanggal_pembuatan']);
        $data['created_by'] = $request->user()->id;

        if ($request->hasFile('gambar_cover')) {
            $gambar = $request->file('gambar_cover');
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

            $response = Http::attach(
                'file',
                file_get_contents($gambar->getRealPath()),
                $gambar->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'album-covers',
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $data['gambar_cover'] = $result['secure_url'];
                $data['gambar_cover_public_id'] = $result['public_id'];
            }
        }

        $album = Album::create($data);
        return response()->json($album, 201);
    }

    public function update(Request $request, Album $album)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_pembuatan' => 'nullable|date',
            'gambar_cover' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'tanggal_pembuatan']);

        if ($request->hasFile('gambar_cover')) {
            if ($album->gambar_cover_public_id) {
                $this->deleteImageFromCloudinary($album->gambar_cover_public_id);
            }

            $gambar = $request->file('gambar_cover');
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

            $response = Http::attach(
                'file',
                file_get_contents($gambar->getRealPath()),
                $gambar->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'album-covers',
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $data['gambar_cover'] = $result['secure_url'];
                $data['gambar_cover_public_id'] = $result['public_id'];
            }
        }

        $album->update($data);
        return response()->json($album);
    }

    public function destroy(Album $album)
    {
        foreach ($album->fotos as $foto) {
            $this->deleteImageFromCloudinary($foto->gambar_public_id);
        }

        if ($album->gambar_cover_public_id) {
            $this->deleteImageFromCloudinary($album->gambar_cover_public_id);
        }

        $album->delete();
        return response()->json(['message' => 'Album berhasil dihapus'], 204);
    }

    public function fotos($albumId)
    {
        $fotos = AlbumFoto::with('user:id,full_name')
            ->where('album_id', $albumId)
            ->latest()
            ->get();

        return response()->json($fotos);
    }

    public function storeFoto(Request $request, $albumId)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'required|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $gambar = $request->file('gambar');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

        $response = Http::attach(
            'file',
            file_get_contents($gambar->getRealPath()),
            $gambar->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
            'upload_preset' => $uploadPreset,
            'folder' => 'album-fotos',
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Gagal upload gambar ke Cloudinary'], 500);
        }

        $result = $response->json();
        $data = $request->only(['judul', 'deskripsi']);
        $data['album_id'] = $albumId;
        $data['uploaded_by'] = $request->user()->id;
        $data['gambar'] = $result['secure_url'];
        $data['gambar_public_id'] = $result['public_id'];

        $foto = AlbumFoto::create($data);
        return response()->json($foto, 201);
    }

    public function destroyFoto($id)
    {
        $foto = AlbumFoto::findOrFail($id);

        // Opsional: tambahkan validasi kepemilikan jika diperlukan
        // if ($foto->uploaded_by !== auth()->id()) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $this->deleteImageFromCloudinary($foto->gambar_public_id);
        $foto->delete();

        return response()->json(['message' => 'Foto berhasil dihapus'], 204);
    }

    private function deleteImageFromCloudinary($publicId)
    {
        try {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $apiKey = env('CLOUDINARY_API_KEY');
            $apiSecret = env('CLOUDINARY_API_SECRET');
            $timestamp = time();

            $signature = sha1("public_id={$publicId}&timestamp={$timestamp}{$apiSecret}");

            Http::asForm()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                'public_id' => $publicId,
                'signature' => $signature,
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal hapus gambar dari Cloudinary: ' . $e->getMessage());
        }
    }
}