<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('donasi_kampanyes', function (Blueprint $table) {
            $table->bigInteger('total_donasi')->default(0)->after('target');
        });
    }

    public function down()
    {
        Schema::table('donasi_kampanyes', function (Blueprint $table) {
            $table->dropColumn('total_donasi');
        });
    }
};