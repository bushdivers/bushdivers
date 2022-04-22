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
            $table->foreignId('contract_type_id');
            $table->string('dep_airport_id');
            $table->string('arr_airport_id');
            $table->decimal('distance');
            $table->integer('heading');
            $table->integer('payload')->nullable();
            $table->integer('pax')->nullable();
            $table->decimal('contract_value')->nullable();
            $table->integer('reputation')->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_completed')->default(false);
            $table->dateTime('expires_at');
            $table->dateTime('completed_at')->nullable();
            $table->foreignId('user_id')->nullable();
            $table->boolean('is_paid')->default(false);
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
