<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Renungan extends Model
{
    use HasFactory;

    protected $table = 'renungans';

    protected $fillable = [
        'judul', 'isi', 'tanggal', 'kategori'
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];
}