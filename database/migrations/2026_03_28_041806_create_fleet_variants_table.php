<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('fleet_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fleet_id')->constrained('fleets')->cascadeOnDelete();
            $table->string('name');
            $table->boolean('is_default')->default(false);
            $table->integer('pax_capacity');
            $table->integer('cargo_capacity');
            $table->integer('fuel_capacity');
            $table->integer('range');
            $table->integer('mtow');
            $table->integer('zfw');
            $table->timestamps();
        });

        // Seed a default variant from every existing fleet row
        DB::statement("
            INSERT INTO fleet_variants (fleet_id, name, is_default, pax_capacity, cargo_capacity, fuel_capacity, `range`, mtow, zfw, created_at, updated_at)
            SELECT id, 'Standard', 1, pax_capacity, cargo_capacity, fuel_capacity, `range`, mtow, zfw, NOW(), NOW()
            FROM fleets
        ");

        Schema::table('fleets', function (Blueprint $table) {
            $table->dropColumn(['pax_capacity', 'cargo_capacity', 'fuel_capacity', 'range', 'mtow', 'zfw']);
        });
    }

    public function down(): void
    {
        Schema::table('fleets', function (Blueprint $table) {
            $table->integer('zfw')->default(0);
            $table->integer('mtow')->default(0);
            $table->integer('cargo_capacity')->default(0);
            $table->integer('pax_capacity')->default(0);
            $table->integer('fuel_capacity')->default(0);
            $table->integer('range')->default(0);
        });

        DB::statement("
            UPDATE fleets f
            JOIN fleet_variants fv ON fv.fleet_id = f.id AND fv.is_default = 1
            SET f.zfw = fv.zfw, f.mtow = fv.mtow, f.cargo_capacity = fv.cargo_capacity,
                f.pax_capacity = fv.pax_capacity, f.fuel_capacity = fv.fuel_capacity, f.`range` = fv.`range`
        ");

        Schema::dropIfExists('fleet_variants');
    }
};
