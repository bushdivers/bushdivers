<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCurrentFlightDataToPirepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->decimal('current_lat', 11, 5)->nullable();
            $table->decimal('current_lon', 11, 5)->nullable();
            $table->integer('current_heading')->nullable();
            $table->integer('current_altitude')->nullable();
            $table->integer('current_indicated_speed')->nullable();
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
            $table->dropColumn('current_lat', 'current_lon', 'current_heading', 'current_altitude', 'current_indicated_speed');
        });
    }
}
