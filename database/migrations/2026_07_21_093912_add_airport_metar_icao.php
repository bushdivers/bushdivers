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
        Schema::table('airports', function (Blueprint $table) {
            $table->string('primary_metar', 15)->nullable()->after('has_jetfuel');
            $table->string('secondary_metar', 15)->nullable()->after('primary_metar');
            $table->timestamp('metar_added_at')->nullable()->after('secondary_metar');
            $table->index('metar_added_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('airports', function (Blueprint $table) {
            $table->dropIndex(['metar_added_at']);
            $table->dropColumn('primary_metar');
            $table->dropColumn('secondary_metar');
            $table->dropColumn('metar_added_at');
        });
    }
};
