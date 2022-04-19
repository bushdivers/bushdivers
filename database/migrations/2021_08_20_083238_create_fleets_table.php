<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFleetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fleets', function (Blueprint $table) {
            $table->id();
            $table->string('type')->unique();
            $table->string('name');
            $table->string('manufacturer');
            $table->string('powerplants');
            $table->string('number_of_engines');
            $table->string('crew_required');
            $table->string('cabin_crew_required');
            $table->integer('fuel_type');
            $table->integer('zfw');
            $table->integer('mtow');
            $table->integer('cargo_capacity');
            $table->integer('pax_capacity');
            $table->integer('fuel_capacity');
            $table->decimal('fuel_consumption')->nullable();
            $table->integer('service_ceiling');
            $table->integer('range');
            $table->integer('cruise_speed');
            $table->string('image_url');
            $table->string('size')->nullable();
            $table->boolean('company_fleet')->default(false);
            $table->decimal('rental_cost')->default(0.00);
            $table->boolean('is_rental')->default(false);
            $table->string('rental_image')->nullable();
            $table->integer('rental_size')->default(0);
            $table->integer('tbo_mins')->default(0);
            $table->decimal('new_price', 12, 2)->nullable();
            $table->decimal('used_low_price', 12, 2)->nullable();
            $table->decimal('used_high_price', 12, 2)->nullable();
            $table->string('hq', 5)->nullable();
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
        Schema::dropIfExists('fleets');
    }
}
