<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul', 'deskripsi', 'gambar_cover', 'gambar_cover_public_id', 'tanggal_pembuatan', 'created_by'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function fotos()
    {
        return $this->hasMany(AlbumFoto::class, 'album_id');
    }
}