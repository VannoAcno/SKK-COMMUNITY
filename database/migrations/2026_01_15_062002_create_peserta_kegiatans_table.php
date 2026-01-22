<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('peserta_kegiatans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('kegiatan_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kegiatan_id')->references('id')->on('kegiatans')->onDelete('cascade');
            
            // Pastikan satu user hanya bisa mendaftar satu kali ke satu kegiatan
            $table->unique(['user_id', 'kegiatan_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('peserta_kegiatans');
    }
};