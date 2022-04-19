<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('airports', function (Blueprint $table) {
            $table->id();
            $table->string('identifier', 5)->index();
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('country')->nullable();
            $table->boolean('is_hub');
            $table->decimal('lat', 11, 5)->index();
            $table->decimal('lon', 11, 5)->index();
            $table->point('point')->nullable();
            $table->decimal('magnetic_variance', 11, 5)->default(0);
            $table->integer('altitude')->nullable();
            $table->integer('size')->nullable();
            $table->integer('longest_runway_length')->nullable();
            $table->integer('longest_runway_width')->nullable();
            $table->string('longest_runway_surface')->nullable();
            $table->boolean('has_avgas')->default(false);
            $table->boolean('has_jetfuel')->default(false);
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
        Schema::dropIfExists('airports');
    }
}
