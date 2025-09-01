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
        Schema::table('aircraft', function (Blueprint $table) {
            $table->renameColumn('current_airport_id', 'current_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'current_airport_id')->after('fleet_id');

            $table->renameColumn('hub_id', 'hub_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'hub_id')->nullable()->after('current_airport_id');

            $table->foreign('fleet_id')->references('id')->on('fleets')->restrictOnDelete();
        });

        $defaultAirportId = DB::table('airports')->where('identifier', 'AYMR')->value('id');
        DB::update('UPDATE aircraft a JOIN airports ap ON a.current_airport_identifier = ap.identifier SET a.current_airport_id = ap.id WHERE a.current_airport_identifier IS NOT NULL');
        DB::update('UPDATE aircraft SET current_airport_id = ? WHERE current_airport_id IS NULL', [$defaultAirportId]);
        DB::update('UPDATE aircraft a JOIN airports ap ON a.hub_identifier = ap.identifier SET a.hub_id = ap.id WHERE a.hub_identifier IS NOT NULL');
        DB::update('UPDATE aircraft SET hub_id = ? WHERE hub_id IS NULL', [$defaultAirportId]);

        Schema::table('aircraft', function (Blueprint $table) {
            $table->dropColumn('current_airport_identifier');
            $table->foreign('current_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('hub_identifier');
            $table->foreign('hub_id')->references('id')->on('airports')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aircraft', function (Blueprint $table) {
            $table->string('current_airport_identifier', 15)->nullable()->after('fleet_id');
            $table->string('hub_identifier', 15)->nullable()->after('current_airport_id');
        });

        DB::update('UPDATE aircraft a JOIN airports ap ON a.current_airport_id = ap.id SET a.current_airport_identifier = ap.identifier WHERE a.current_airport_id IS NOT NULL');
        DB::update('UPDATE aircraft a JOIN airports ap ON a.hub_id = ap.id SET a.hub_identifier = ap.identifier WHERE a.hub_id IS NOT NULL');

        Schema::table('aircraft', function (Blueprint $table) {
            $table->dropForeign(['current_airport_id']);
            $table->dropForeign(['hub_id']);
            $table->dropColumn('current_airport_id');
            $table->dropColumn('hub_id');
        });

        Schema::table('aircraft', function (Blueprint $table) {
            $table->dropForeign(['fleet_id']);
            $table->renameColumn('current_airport_identifier', 'current_airport_id');
            $table->renameColumn('hub_identifier', 'hub_id');
            $table->string('current_airport_id', 15)->nullable(false)->change();
            $table->string('hub_id', 15)->nullable(false)->change();
        });

    }
};
