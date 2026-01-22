<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('kegiatans', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('gambar_public_id'); // Tambahkan kolom
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null'); // Tambahkan foreign key
        });
    }

    public function down()
    {
        Schema::table('kegiatans', function (Blueprint $table) {
            $table->dropForeign(['user_id']); // Hapus foreign key dulu
            $table->dropColumn('user_id'); // Baru hapus kolom
        });
    }
};