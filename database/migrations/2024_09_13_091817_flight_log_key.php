<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('flight_logs')
        ->whereNotExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('pireps')
                ->whereColumn('flight_logs.pirep_id', 'pireps.id');
        })->delete();

        Schema::table('flight_logs', function (Blueprint $table) {
            $table->foreign('pirep_id')->references('id')->on('pireps')->cascadeOnDelete();
        });
        //
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('flight_logs', function (Blueprint $table) {
            $table->dropForeign(['pirep_id']);
            $table->dropIndex('flight_logs_pirep_id_foreign');
        });
        //
    }
};
