<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('role');
        });

        // Insert default roles
        DB::table('roles')->insert([
            ['id' => 1, 'role' => 'fleet_manager'],
            ['id' => 2, 'role' => 'resource_manager'],
            ['id' => 3, 'role' => 'fleet_admin'],
            ['id' => 4, 'role' => 'airport_manager'],
         ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('roles');
    }
}
