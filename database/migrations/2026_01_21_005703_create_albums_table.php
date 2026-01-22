<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('gambar_cover')->nullable(); // URL cover album
            $table->string('gambar_cover_public_id')->nullable(); // ID di Cloudinary
            $table->date('tanggal_pembuatan')->nullable();
            $table->unsignedBigInteger('created_by'); // User yang buat
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('albums');
    }
};