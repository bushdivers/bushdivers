<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('hub_id');
            $table->string('current_airport_id');
            $table->bigInteger('flights')->default(0);
            $table->bigInteger('flights_time')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('toc_accepted');
            $table->boolean('opt_in');
            $table->string('msfs_username')->nullable();
            $table->string('volanta_username')->nullable();
            $table->string('discord_username')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
