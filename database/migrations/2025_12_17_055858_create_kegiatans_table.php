<?php

// database/migrations/..._create_kegiatans_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('kegiatans', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->string('lokasi')->nullable();
            $table->enum('tipe', ['agenda', 'laporan'])->default('agenda');
            $table->string('gambar')->nullable();
            $table->string('gambar_public_id')->nullable(); // untuk hapus dari Cloudinary
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('kegiatans');
    }
};