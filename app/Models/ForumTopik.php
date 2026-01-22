<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumTopik extends Model
{
    use HasFactory;

    protected $table = 'forum_topiks';

    protected $fillable = [
        'judul', 'isi', 'user_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function komentars()
    {
        return $this->hasMany(ForumKomentar::class, 'topik_id');
    }
}