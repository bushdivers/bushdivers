<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractCargosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contract_cargos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id');
            $table->foreignId('cargo_type_id');
            $table->string('dep_airport_id')->nullable();
            $table->string('arr_airport_id')->nullable();
            $table->string('current_airport_id');
            $table->string('cargo')->nullable();
            $table->integer('cargo_qty')->nullable();
            $table->decimal('contract_value')->default(0);
            $table->decimal('distance')->nullable();
            $table->integer('heading')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->dateTime('completed_at')->nullable();
            $table->foreignId('user_id')->nullable();
            $table->boolean('is_available')->default(true);
            $table->uuid('active_pirep')->nullable();
            $table->uuid('completed_pirep')->nullable();
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
        Schema::dropIfExists('contract_cargos');
    }
}
