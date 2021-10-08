<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirlineFeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('airline_fees', function (Blueprint $table) {
            $table->id();
            $table->integer('fee_type');
            $table->string('fee_name');
            $table->integer('fee_weight')->nullable();
            $table->decimal('fee_amount');
            $table->boolean('daily')->default(false);
            $table->boolean('monthly')->default(false);
            $table->boolean('yearly')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('airline_fees');
    }
}
