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
        DB::update('UPDATE account_ledgers SET pirep_id = NULL WHERE pirep_id IS NOT NULL AND pirep_id NOT IN (SELECT id FROM pireps)');
        Schema::table('account_ledgers', function (Blueprint $table) {
            $table->foreign('pirep_id')->references('id')->on('pireps')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('account_ledgers', function (Blueprint $table) {
            $table->dropForeign(['pirep_id']);
            $table->dropIndex('account_ledgers_pirep_id_foreign');
        });
    }
};
