<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAircraftTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aircraft', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fleet_id');
            $table->string('current_airport_id');
            $table->string('hub_id')->nullable()->index();
            $table->string('registration')->unique();
            $table->dateTime('last_flight')->nullable();
            $table->decimal('last_lat', 11,5)->nullable();
            $table->decimal('last_lon', 11,5)->nullable();
            $table->decimal('fuel_onboard')->default(0);
            $table->integer('flight_time_mins')->default(0);
            $table->integer('state')->default(0);
            $table->integer('status')->default(0);
            $table->foreignId('user_id')->nullable();
            $table->foreignId('owner_id')->default(0)->nullable();
            $table->dateTime('last_inspected_at')->nullable();
            $table->decimal('wear')->default(100);
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
        Schema::dropIfExists('aircraft');
    }
}
