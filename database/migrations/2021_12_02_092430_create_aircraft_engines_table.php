<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAircraftEnginesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aircraft_engines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aircraft_id');
            $table->integer('engine_no');
            $table->integer('mins_since_tbo')->default(0);
            $table->integer('mins_since_100hr')->default(0);
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
        Schema::dropIfExists('aircraft_engines');
    }
}
