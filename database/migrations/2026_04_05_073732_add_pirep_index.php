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
        Schema::table('pireps', function (Blueprint $table) {
            $table->index('state');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->dropIndex(['state']);
            $table->dropForeign(['user_id']);
            $table->dropIndex('pireps_user_id_foreign');
        });
    }
};
