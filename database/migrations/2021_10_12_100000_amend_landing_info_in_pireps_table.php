<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AmendLandingInfoInPirepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->decimal('landing_pitch', 11, 5)->change();
            $table->decimal('landing_bank', 11, 5)->change();
            $table->decimal('landing_lat', 11, 5)->change();
            $table->decimal('landing_lon', 11, 5)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pireps', function (Blueprint $table) {
            //
        });
    }
}
