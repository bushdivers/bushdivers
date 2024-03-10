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
        Schema::table('airports', function (Blueprint $table) {
            $table->bigInteger('avgas_qty')->nullable()->default(0);
            $table->decimal('avgas_price', 12, 2)->nullable()->default(6.10);
            $table->bigInteger('jetfuel_qty')->nullable()->default(0);
            $table->decimal('jetfuel_price', 12, 2)->nullable()->default(4.60);
        });

        // ensure hubs have avgas and jetful unlimited
        DB::update(
    'UPDATE airports SET has_avgas = true, has_jetfuel = true, avgas_qty = null, jetfuel_qty = null WHERE is_hub = true'
        );

        // size 4+ random qty
        DB::update(
            'UPDATE airports SET avgas_qty = ? WHERE size >= 4 AND is_hub = false AND has_avgas = true',
            [mt_rand(5000, 10000)]
        );
        DB::update(
            'UPDATE airports SET jetfuel_qty = ? WHERE size >= 4 AND is_hub = false AND has_jetfuel = true',
            [mt_rand(5000, 10000)]
        );

        // size 3 + lower
        DB::update(
            'UPDATE airports SET avgas_qty = ? WHERE size <= 3 AND is_hub = false AND has_avgas = true',
            [mt_rand(500, 1000)]
        );
        DB::update(
            'UPDATE airports SET jetfuel_qty = ? WHERE size <= 3 AND is_hub = false AND has_jetfuel = true',
            [mt_rand(500, 1000)]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('airports', function (Blueprint $table) {
            $table->dropColumn(['avgas_qty', 'avgas_price', 'jetfuel_qty', 'jetfuel_price']);
        });
    }
};
