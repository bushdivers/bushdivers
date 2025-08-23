<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->foreignId('award_id')->nullable();
            $table->string('start_airport_id');
            $table->timestamps();
        });

        \Illuminate\Support\Facades\DB::table('roles')->insert([
            'role' => 'tour_admin',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');

        // Remove the tour_admin role if it exists
        \Illuminate\Support\Facades\DB::table('roles')->where('role', 'tour_admin')->delete();
    }
};
