<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonasiKampanye extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'deskripsi',
        'target',
        'gambar',
        'is_active',
        'total_donasi',
    ];

    // 🔥 TAMBAHKAN INI 🔥
    protected $casts = [
        'target' => 'integer',
        'total_donasi' => 'integer', // ← Ini sangat penting!
    ];

    public function donasis()
    {
        return $this->hasMany(Donasi::class, 'kampanye_id');
    }

    public function getProgressPercentageAttribute()
    {
        if (!$this->target || $this->target === 0) return 0;
        return min(100, round(($this->total_donasi / $this->target) * 100));
    }
}