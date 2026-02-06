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
        'user_id',
        'is_active',
    ];

    /**
     * Scope untuk mengambil kegiatan yang boleh ditampilkan ke user publik:
     * - Semua laporan (tipe = 'laporan') yang aktif
     * - Agenda yang tanggal_mulai-nya belum lewat dan aktif
     */
    public function scopeForPublic($query)
    {
        $today = now()->toDateString();
        return $query->where('is_active', true)
            ->where(function ($q) use ($today) {
                $q->where('tipe', 'laporan')
                  ->orWhere(function ($q2) use ($today) {
                      $q2->where('tipe', 'agenda')
                         ->whereDate('tanggal_mulai', '>=', $today);
                  });
            });
    }

    /**
     * Relasi: Kegiatan dibuat oleh satu user (admin).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // <-- Tambahkan ini
    }

    /**
     * Relasi: Kegiatan bisa memiliki banyak peserta (user).
     */
    public function peserta()
    {
        return $this->belongsToMany(User::class, 'peserta_kegiatans', 'kegiatan_id', 'user_id');
    }
}