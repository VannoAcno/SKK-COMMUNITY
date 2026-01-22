<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ForumTopik;
use App\Models\ForumKomentar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ForumPublicController extends Controller
{
    public function index()
    {
        $topiks = ForumTopik::with(['user:id,full_name,avatar'])
            ->select('id', 'judul', 'isi', 'user_id', 'created_at') // Ambil hanya kolom yang dibutuhkan
            ->addSelect([
                'komentars_count' => ForumKomentar::selectRaw('COUNT(*)')
                    ->whereColumn('forum_komentars.topik_id', 'forum_topiks.id')
                    ->take(1)
            ])
            ->latest()
            ->get();

        return response()->json($topiks);
    }

    public function show($id)
    {
        $topik = ForumTopik::with([
            'user:id,full_name,avatar',
            'komentars.user:id,full_name,avatar'
        ])->find($id);
        
        if (!$topik) {
            return response()->json(['message' => 'Topik tidak ditemukan'], 404);
        }

        return response()->json($topik);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $topik = ForumTopik::create([
            'judul' => $request->judul,
            'isi' => $request->isi,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($topik, 201);
    }

    public function komentar(Request $request, $topikId)
    {
        $validator = Validator::make($request->all(), [
            'isi' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $komentar = ForumKomentar::create([
            'isi' => $request->isi,
            'user_id' => $request->user()->id,
            'topik_id' => $topikId,
        ]);

        // Load user untuk mengembalikan full_name & avatar
        $komentar->load('user:id,full_name,avatar');

        return response()->json($komentar, 201);
    }

    // ✅ Tambahkan method untuk user mengedit komentar miliknya sendiri
    public function updateKomentar(Request $request, ForumKomentar $komentar)
    {
        // Cek apakah user adalah pemilik komentar
        if ($komentar->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk mengedit komentar ini'], 403);
        }

        $validator = Validator::make($request->all(), [
            'isi' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $komentar->update([
            'isi' => $request->isi,
        ]);

        // Load user untuk mengembalikan full_name & avatar
        $komentar->load('user:id,full_name,avatar');

        return response()->json($komentar);
    }

    // ✅ Tambahkan method untuk user menghapus komentar miliknya sendiri
    public function destroyKomentar(Request $request, ForumKomentar $komentar)
    {
        // Cek apakah user adalah pemilik komentar
        if ($komentar->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk menghapus komentar ini'], 403);
        }

        $komentar->delete();
        // ✅ Ganti 204 ke 200 agar bisa di-parse JSON-nya
        return response()->json(['message' => 'Komentar berhasil dihapus'], 200);
    }
}