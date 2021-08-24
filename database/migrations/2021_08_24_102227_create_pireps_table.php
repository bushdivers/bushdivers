<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePirepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pireps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id');
            $table->string('flight_id')->index();
            $table->foreignId('booking_id');
            $table->foreignId('aircraft_id');
            $table->integer('flight_type');
            $table->integer('cargo');
            $table->string('cargo_name')->nullable();
            $table->integer('pax');
            $table->string('pax_name')->nullable();
            $table->integer('planned_cruise_altitude');
            $table->decimal('planned_fuel')->nullable();
            $table->decimal('block_fuel')->nullable();
            $table->decimal('fuel_used')->nullable();
            $table->integer('distance')->nullable();
            $table->integer('flight_time')->nullable();
            $table->decimal('landing_rate')->nullable();
            $table->integer('score')->nullable();
            $table->integer('state')->default(1);
            $table->integer('status')->default(1);
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('block_off_time')->nullable();
            $table->dateTime('block_on_time')->nullable();
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
        Schema::dropIfExists('pireps');
    }
}
