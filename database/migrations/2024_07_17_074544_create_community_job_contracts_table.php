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
        Schema::create('community_job_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('dep_airport_id');
            $table->string('arr_airport_id');
            $table->integer('cargo_type');
            $table->integer('payload')->nullable();
            $table->integer('pax')->nullable();
            $table->integer('remaining_payload')->nullable();
            $table->integer('remaining_pax')->nullable();
            $table->string('cargo');
            $table->boolean('is_completed')->default(false);
            $table->dateTime('completed_at')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->foreignId('community_job_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_jobs');
    }
};
