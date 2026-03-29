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
        Schema::table('aircraft', function (Blueprint $table) {
            $table->foreignId('fleet_variant_id')->nullable()->after('fleet_id')
                ->constrained('fleet_variants')->nullOnDelete();
        });

        Schema::table('rentals', function (Blueprint $table) {
            $table->foreignId('fleet_variant_id')->nullable()->after('fleet_id')
                ->constrained('fleet_variants')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aircraft', function (Blueprint $table) {
            $table->dropForeign(['fleet_variant_id']);
            $table->dropColumn('fleet_variant_id');
        });

        Schema::table('rentals', function (Blueprint $table) {
            $table->dropForeign(['fleet_variant_id']);
            $table->dropColumn('fleet_variant_id');
        });
    }
};
