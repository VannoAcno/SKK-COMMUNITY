<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumTopik;
use App\Models\ForumKomentar;
use Illuminate\Http\Request;

class ForumController extends Controller
{
    public function index()
    {
        $topiks = ForumTopik::with(['user:id,full_name,avatar'])
            ->select('id', 'judul', 'isi', 'user_id', 'created_at')
            ->latest()
            ->get();
        
        return response()->json($topiks);
    }

    public function destroyTopik(ForumTopik $topik)
    {
        $topik->komentars()->delete(); // Hapus semua komentar
        $topik->delete();
        return response()->json(['message' => 'Topik berhasil dihapus'], 204);
    }

    public function destroyKomentar(ForumKomentar $komentar)
    {
        $komentar->delete();
        return response()->json(['message' => 'Komentar berhasil dihapus'], 204);
    }
}