<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOwnerFlagToAircraftTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('aircraft', function (Blueprint $table) {
            $table->foreignId('owner_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('aircraft', function (Blueprint $table) {
            $table->dropColumn('owner_id');
        });
    }
}
