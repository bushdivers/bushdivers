<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->unsignedBigInteger('departure_airport_fk_id')->nullable()->after('aircraft_id');
            $table->unsignedBigInteger('arrival_airport_fk_id')->nullable()->after('departure_airport_fk_id');
        });
    }

    public function down(): void
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->dropColumn(['departure_airport_fk_id', 'arrival_airport_fk_id']);
        });
    }
};
