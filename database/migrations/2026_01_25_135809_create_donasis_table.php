<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('donasis', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('email')->nullable();
            $table->unsignedBigInteger('nominal');
            $table->text('pesan')->nullable();
            $table->string('bukti_transfer_path'); // Path bukti transfer (screenshot)
            $table->enum('status', ['pending', 'success', 'rejected'])->default('pending');
            $table->foreignId('kampanye_id')->nullable()->constrained('donasi_kampanyes')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('donasis');
    }
};