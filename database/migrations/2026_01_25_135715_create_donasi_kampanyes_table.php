<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('donasi_kampanyes', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->unsignedBigInteger('target')->nullable(); // Target dana
            $table->string('gambar')->nullable(); // URL gambar dari Cloudinary
            $table->string('gambar_public_id')->nullable(); // Public ID untuk Cloudinary
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('donasi_kampanyes');
    }
};