<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'email',
        'nominal',
        'pesan',
        'bukti_transfer_path',
        'status',
        'kampanye_id',
        'user_id',
    ];

    protected $casts = [
        'nominal' => 'integer',
        'kampanye_id' => 'integer',
        'user_id' => 'integer',
    ];

    // Relasi: Donasi milik satu User (opsional)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Donasi milik satu Kampanye (opsional)
    public function kampanye()
    {
        return $this->belongsTo(DonasiKampanye::class, 'kampanye_id');
    }
}