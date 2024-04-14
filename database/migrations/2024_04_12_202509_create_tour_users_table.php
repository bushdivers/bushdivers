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
        Schema::create('tour_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id');
            $table->foreignId('user_id');
            $table->string('next_checkpoint');
            $table->boolean('is_completed')->default(false);
            $table->dateTime('completed_at')->nullable();
            $table->integer('progress')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_users');
    }
};
