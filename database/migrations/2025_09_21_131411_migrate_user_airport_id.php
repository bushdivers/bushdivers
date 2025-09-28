<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('current_airport_id', 'current_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'current_airport_id')->after('password');
        });

        $defaultAirportId = DB::table('airports')->where('identifier', 'AYMR')->value('id');
        DB::update('UPDATE users u JOIN airports ap ON u.current_airport_identifier = ap.identifier SET u.current_airport_id = ap.id WHERE u.current_airport_identifier IS NOT NULL');
        DB::update('UPDATE users SET current_airport_id = ? WHERE IFNULL(current_airport_id,0) = 0', [$defaultAirportId]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('current_airport_identifier');
            $table->foreign('current_airport_id')->references('id')->on('airports')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('current_airport_identifier', 15)->nullable()->after('password');
        });

        DB::update('UPDATE users u JOIN airports ap ON u.current_airport_id = ap.id SET u.current_airport_identifier = ap.identifier WHERE u.current_airport_id IS NOT NULL');

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['current_airport_id']);
            $table->dropColumn('current_airport_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('current_airport_identifier', 'current_airport_id');
        });
    }
};
