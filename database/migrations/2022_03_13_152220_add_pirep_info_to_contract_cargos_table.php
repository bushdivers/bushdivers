<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPirepInfoToContractCargosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contract_cargos', function (Blueprint $table) {
            $table->uuid('active_pirep')->nullable();
            $table->uuid('completed_pirep')->nullable();
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
            $table->dropColumn('active_pirep', 'completed_pirep');
        });
    }
}
