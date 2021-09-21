<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('dep_airport_id');
            $table->string('arr_airport_id');
            $table->string('current_airport_id');
            $table->foreignId('contract_type_id');
            $table->string('cargo')->nullable();
            $table->integer('cargo_qty')->nullable();
            $table->string('pax')->nullable();
            $table->integer('pax_qty')->nullable();
            $table->decimal('distance');
            $table->integer('heading');
            $table->decimal('contract_value');
            $table->integer('reputation')->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_completed')->default(false);
            $table->dateTime('expires_at');
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
        Schema::dropIfExists('contracts');
    }
}
