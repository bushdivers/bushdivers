<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->integer('flight_number')->index();
            $table->string('dep_airport_id', 5)->index();
            $table->string('arr_airport_id', 5)->index();
            $table->string('alt_airport_id', 5)->index();
            $table->decimal('distance');
            $table->integer('flight_type');
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('flights');
    }
}
