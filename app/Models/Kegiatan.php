<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi',
        'tipe',
        'gambar',
        'gambar_public_id',
    ];

    /**
     * Scope untuk mengambil kegiatan yang boleh ditampilkan ke user publik:
     * - Semua laporan (tipe = 'laporan')
     * - Agenda yang tanggal_mulai-nya belum lewat
     */
    public function scopeForPublic($query)
    {
        $today = now()->toDateString();
        return $query->where('tipe', 'laporan')
                     ->orWhere(function ($q) use ($today) {
                         $q->where('tipe', 'agenda')
                           ->whereDate('tanggal_mulai', '>=', $today);
                     });
    }

    /**
     * Relasi: Kegiatan bisa memiliki banyak peserta (user).
     */
    public function peserta()
    {
        return $this->belongsToMany(User::class, 'peserta_kegiatan', 'kegiatan_id', 'user_id');
    }
}