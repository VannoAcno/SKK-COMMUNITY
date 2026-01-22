<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlbumFoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul', 'deskripsi', 'gambar', 'gambar_public_id', 'album_id', 'uploaded_by'
    ];

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}