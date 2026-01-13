<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Renungan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RenunganController extends Controller
{
    public function index()
    {
        $renungans = Renungan::latest()->get();
        return response()->json($renungans);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'isi', 'tanggal', 'kategori']);

        try {
            $renungan = Renungan::create($data);
            return response()->json($renungan, 201);
        } catch (\Exception $e) {
            Log::error('Failed to create renungan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menambahkan renungan'], 500);
        }
    }

    public function show(Renungan $renungan)
    {
        return response()->json($renungan);
    }

    public function update(Request $request, Renungan $renungan)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'isi', 'tanggal', 'kategori']);

        try {
            $renungan->update($data);
            return response()->json($renungan);
        } catch (\Exception $e) {
            Log::error('Failed to update renungan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memperbarui renungan'], 500);
        }
    }

    public function destroy(Renungan $renungan)
    {
        try {
            $renungan->delete();
            return response()->json(['message' => 'Renungan berhasil dihapus'], 204);
        } catch (\Exception $e) {
            Log::error('Failed to delete renungan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menghapus renungan'], 500);
        }
    }
}