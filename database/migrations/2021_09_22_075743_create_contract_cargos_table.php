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
            $table->foreignId('contract_type_id');
            $table->string('current_airport_id');
            $table->string('cargo')->nullable();
            $table->integer('cargo_qty')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->dateTime('completed_at')->nullable();
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
