<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('forum_komentars', function (Blueprint $table) {
            $table->id();
            $table->text('isi');
            $table->unsignedBigInteger('user_id'); // Foreign key ke users
            $table->unsignedBigInteger('topik_id'); // Foreign key ke forum_topiks
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('topik_id')->references('id')->on('forum_topiks')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('forum_komentars');
    }
};