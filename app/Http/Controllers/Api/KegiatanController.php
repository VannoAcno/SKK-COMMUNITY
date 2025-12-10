<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class KegiatanController extends Controller
{
    public function index()
    {
        $kegiatans = Kegiatan::latest()->get();
        return response()->json($kegiatans);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:agenda,laporan',
            'tanggal_mulai' => 'required|date',
            'gambar' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe']);

        // Upload gambar ke Cloudinary
        if ($request->hasFile('gambar')) {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

            $file = $request->file('gambar');
            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
            ]);

            if ($response->successful()) {
                $data['gambar'] = $response->json()['secure_url'];
            }
        }

        $kegiatan = Kegiatan::create($data);
        return response()->json($kegiatan, 201);
    }

    public function show(Kegiatan $kegiatan)
    {
        return response()->json($kegiatan);
    }

    public function update(Request $request, Kegiatan $kegiatan)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:agenda,laporan',
            'tanggal_mulai' => 'required|date',
            'gambar' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'tipe']);

        // Upload gambar baru
        if ($request->hasFile('gambar')) {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');

            $file = $request->file('gambar');
            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
            ]);

            if ($response->successful()) {
                $data['gambar'] = $response->json()['secure_url'];
            }
        }

        $kegiatan->update($data);
        return response()->json($kegiatan);
    }

    public function destroy(Kegiatan $kegiatan)
    {
        $kegiatan->delete();
        return response()->json(null, 204);
    }
}