<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLandingInfoToPirepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->decimal('landing_pitch')->nullable();
            $table->decimal('landing_bank')->nullable();
            $table->decimal('landing_lat')->nullable();
            $table->decimal('landing_lon')->nullable();
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
            $table->dropColumn(['landing_pitch', 'landing_bank', 'landing_lat', 'landing_lon']);
        });
    }
}
