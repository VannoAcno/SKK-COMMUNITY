<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('peserta_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('kegiatan_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Agar tidak bisa mendaftar ke kegiatan yang sama lebih dari sekali
            $table->unique(['user_id', 'kegiatan_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('peserta_kegiatan');
    }
};