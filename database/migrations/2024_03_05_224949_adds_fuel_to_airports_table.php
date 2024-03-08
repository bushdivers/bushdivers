<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('airports', function (Blueprint $table) {
            $table->bigInteger('avgas_qty')->nullable()->default(0);
            $table->decimal('avgas_price', 12, 2)->nullable()->default(3.10);
            $table->bigInteger('jetfuel_qty')->nullable()->default(0);
            $table->decimal('jetfuel_price', 12, 2)->nullable()->default(2.60);
        });
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
