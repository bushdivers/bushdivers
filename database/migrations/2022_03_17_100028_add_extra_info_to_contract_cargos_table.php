<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExtraInfoToContractCargosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contract_cargos', function (Blueprint $table) {
            $table->decimal('distance')->nullable();
            $table->integer('heading')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contract_cargos', function (Blueprint $table) {
            $table->dropColumn('distance', 'heading');
        });
    }
}
