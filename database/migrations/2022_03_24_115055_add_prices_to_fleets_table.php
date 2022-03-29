<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPricesToFleetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fleets', function (Blueprint $table) {
            $table->decimal('new_price', 12, 2)->nullable();
            $table->decimal('used_low_price', 12, 2)->nullable();
            $table->decimal('used_high_price', 12, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fleets', function (Blueprint $table) {
            $table->dropColumn('new_price', 'used_low_price', 'used_high_price');
        });
    }
}
