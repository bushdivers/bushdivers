<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->foreignId('fleet_variant_id')->nullable()->after('aircraft_id')
                ->constrained('fleet_variants')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->dropForeign(['fleet_variant_id']);
            $table->dropColumn('fleet_variant_id');
        });
    }
};
