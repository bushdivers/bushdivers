<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddsUpdatedValueToContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->boolean('days_updated')->default(false);
            $table->boolean('day_updated')->default(false);
            $table->boolean('half_updated')->default(false);
            $table->boolean('hours_updated')->default(false);
            $table->boolean('hour_updated')->default(false);
            $table->boolean('mins_updated')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts', function (Blueprint $table) {
            //
        });
    }
}
