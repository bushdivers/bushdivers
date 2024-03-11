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
            $table->decimal('avgas_price', 12, 2)->nullable();
            $table->bigInteger('jetfuel_qty')->nullable()->default(0);
            $table->decimal('jetfuel_price', 12, 2)->nullable();
        });

        // ensure hubs have avgas and jetful unlimited
        DB::update(
    'UPDATE airports SET has_avgas = true, has_jetfuel = true, avgas_qty = null, jetfuel_qty = null WHERE is_hub = true'
        );

        // randomise fuel prices
        DB::update(
            'UPDATE airports SET avgas_price = ROUND(RAND()*(7.99-5.69)+5.69, 2), jetfuel_price = ROUND(RAND()*(5.49-3.29)+3.29, 2)'
        );

        // size 4+ random qty
        DB::update(
            'UPDATE airports SET avgas_qty = FLOOR(RAND()*(10000-5000+1)+5000) WHERE size >= 4 AND is_hub = false AND has_avgas = true'
        );
        DB::update(
            'UPDATE airports SET jetfuel_qty = FLOOR(RAND()*(10000-5000+1)+5000) WHERE size >= 4 AND is_hub = false AND has_jetfuel = true'
        );

        // size 3
        DB::update(
            'UPDATE airports SET avgas_qty = FLOOR(RAND()*(1000-500+1)+500) WHERE size = 3 AND is_hub = false AND has_avgas = true'
        );
        DB::update(
            'UPDATE airports SET jetfuel_qty = FLOOR(RAND()*(1000-500+1)+500) WHERE size = 3 AND is_hub = false AND has_jetfuel = true'
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
