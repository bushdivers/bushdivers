<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::delete('DELETE FROM user_accounts WHERE user_id NOT IN (SELECT id FROM users)');
        DB::update('UPDATE user_accounts SET flight_id = NULL WHERE flight_id IS NOT NULL AND flight_id NOT IN (SELECT id FROM pireps)');
        Schema::table('user_accounts', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('flight_id')->references('id')->on('pireps')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_accounts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex('user_accounts_user_id_foreign');

            $table->dropForeign(['flight_id']);
            $table->dropIndex('user_accounts_flight_id_foreign');
        });
    }
};
