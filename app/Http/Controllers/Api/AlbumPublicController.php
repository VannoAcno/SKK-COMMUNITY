<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumFoto;
use Illuminate\Http\Request;

class AlbumPublicController extends Controller
{
    public function index()
    {
        $albums = Album::withCount('fotos')->latest()->get();
        return response()->json($albums);
    }

    public function show($id)
    {
        $album = Album::with(['fotos', 'user:id,full_name'])->find($id);
        
        if (!$album) {
            return response()->json(['message' => 'Album tidak ditemukan'], 404);
        }

        return response()->json($album);
    }

    public function fotosByAlbum($albumId)
    {
        $fotos = AlbumFoto::with('user:id,full_name')
            ->where('album_id', $albumId)
            ->latest()
            ->get();
        
        return response()->json($fotos);
    }
}