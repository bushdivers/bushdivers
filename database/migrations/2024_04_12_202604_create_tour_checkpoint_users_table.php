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
        Schema::create('tour_checkpoint_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id');
            $table->integer('section');
            $table->string('checkpoint');
            $table->foreignId('user_id');
            $table->boolean('is_completed')->default(false);
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_checkpoint_users');
    }
};
