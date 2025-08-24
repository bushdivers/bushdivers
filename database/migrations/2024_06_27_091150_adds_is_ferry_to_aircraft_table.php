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
        Schema::table('aircraft', function (Blueprint $table) {
            $table->boolean('is_ferry')->default(false);
            $table->foreignId('ferry_user_id')->nullable()->constrained('users', 'id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aircraft', function (Blueprint $table) {
            $table->dropForeign(['ferry_user_id']);
            $table->dropColumn(['is_ferry', 'ferry_user_id']);
        });
    }
};
