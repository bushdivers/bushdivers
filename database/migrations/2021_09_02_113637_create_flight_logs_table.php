<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlightLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('flight_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('pirep_id');
            $table->decimal('lat', 11, 5);
            $table->decimal('lon', 11, 5);
            $table->integer('distance')->default(0);
            $table->integer('heading');
            $table->integer('altitude');
            $table->integer('indicated_speed');
            $table->integer('ground_speed');
            $table->decimal('fuel_flow', 11, 2);
            $table->decimal('vs', 11, 2);
            $table->dateTime('sim_time');
            $table->dateTime('zulu_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('flight_logs');
    }
}
