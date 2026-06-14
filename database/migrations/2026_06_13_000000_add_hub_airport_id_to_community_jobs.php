<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('community_jobs', function (Blueprint $table) {
            $table->foreignId('hub_airport_id')->nullable()->after('allow_private')->constrained('airports')->onDelete('restrict');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['hub_airport_id']);
            $table->dropColumn('hub_airport_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_jobs', function (Blueprint $table) {
            $table->dropForeign(['hub_airport_id']);
            $table->dropColumn('hub_airport_id');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->foreignId('hub_airport_id')->nullable()->constrained('airports')->onDelete('restrict');
        });
    }
};
