<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('renungans', function (Blueprint $table) {
            $table->id();
            $table->string('judul'); // Judul ayat
            $table->text('isi'); // Isi renungan
            $table->date('tanggal'); // Tanggal renungan
            $table->string('kategori', 50); // Misal: Pagi, Malam, Mingguan
            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('renungans');
    }
};