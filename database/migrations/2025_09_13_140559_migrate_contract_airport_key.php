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
        Schema::table('contracts', function (Blueprint $table) {
            $table->renameColumn('dep_airport_id', 'dep_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'dep_airport_id')->after('contract_type_id');
            $table->renameColumn('arr_airport_id', 'arr_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'arr_airport_id')->after('dep_airport_id');
            $table->renameColumn('current_airport_id', 'current_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'current_airport_id')->after('arr_airport_id');
            $table->foreignIdFor(\App\Models\Airport::class, 'hub_airport_id')->nullable()->after('airport');
        });

        $defaultAirportId = DB::table('airports')->where('identifier', 'AYMR')->value('id');
        DB::update('UPDATE contracts c JOIN airports ap ON c.dep_airport_identifier = ap.identifier SET c.dep_airport_id = ap.id WHERE c.dep_airport_identifier IS NOT NULL');
        DB::update('UPDATE contracts SET dep_airport_id = ? WHERE IFNULL(dep_airport_id,0) = 0', [$defaultAirportId]);
        DB::update('UPDATE contracts c JOIN airports ap ON c.arr_airport_identifier = ap.identifier SET c.arr_airport_id = ap.id WHERE c.arr_airport_identifier IS NOT NULL');
        DB::update('UPDATE contracts SET arr_airport_id = ? WHERE IFNULL(arr_airport_id,0) = 0', [$defaultAirportId]);
        DB::update('UPDATE contracts c JOIN airports ap ON c.current_airport_identifier = ap.identifier SET c.current_airport_id = ap.id WHERE c.current_airport_identifier IS NOT NULL');
        DB::update('UPDATE contracts SET current_airport_id = ? WHERE IFNULL(current_airport_id,0) = 0', [$defaultAirportId]);
        DB::update('UPDATE contracts c JOIN airports ap ON c.airport = ap.identifier SET c.hub_airport_id = ap.id WHERE c.airport IS NOT NULL');


        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn('dep_airport_identifier');
            $table->foreign('dep_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('arr_airport_identifier');
            $table->foreign('arr_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('current_airport_identifier');
            $table->foreign('current_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('airport');
            $table->foreign('hub_airport_id')->references('id')->on('airports')->nullOnDelete();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->string('dep_airport_identifier', 15)->nullable()->after('id');
            $table->string('arr_airport_identifier', 15)->nullable()->after('dep_airport_id');
            $table->string('current_airport_identifier', 15)->nullable()->after('arr_airport_id');
            $table->string('airport', 15)->nullable()->after('hub_airport_id');
        });

        DB::update('UPDATE contracts c JOIN airports ap ON c.dep_airport_id = ap.id SET c.dep_airport_identifier = ap.identifier WHERE c.dep_airport_id IS NOT NULL');
        DB::update('UPDATE contracts c JOIN airports ap ON c.arr_airport_id = ap.id SET c.arr_airport_identifier = ap.identifier WHERE c.arr_airport_id IS NOT NULL');
        DB::update('UPDATE contracts c JOIN airports ap ON c.current_airport_id = ap.id SET c.current_airport_identifier = ap.identifier WHERE c.current_airport_id IS NOT NULL');
        DB::update('UPDATE contracts c JOIN airports ap ON c.hub_airport_id = ap.id SET c.airport = ap.identifier WHERE c.hub_airport_id IS NOT NULL');

        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['dep_airport_id']);
            $table->dropForeign(['arr_airport_id']);
            $table->dropForeign(['current_airport_id']);
            $table->dropForeign(['hub_airport_id']);
            $table->dropColumn('dep_airport_id');
            $table->dropColumn('arr_airport_id');
            $table->dropColumn('current_airport_id');
            $table->dropColumn('hub_airport_id');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->renameColumn('dep_airport_identifier', 'dep_airport_id');
            $table->renameColumn('arr_airport_identifier', 'arr_airport_id');
            $table->renameColumn('current_airport_identifier', 'current_airport_id');
        });
    }
};
