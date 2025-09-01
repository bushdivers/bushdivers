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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('allow_thirdparty_airport')->default(false)->after('points');
            $table->boolean('allow_campsite_airport')->default(false)->after('allow_thirdparty_airport');
        });

        Schema::table('airports', function (Blueprint $table) {
            $table->string('identifier', 15)->unique()->change(); // lengthen to handle 'BDV0001'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['allow_thirdparty_airport', 'allow_campsite_airport']);
        });
    }
};
