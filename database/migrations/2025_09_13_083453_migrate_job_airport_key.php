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
        Schema::table('community_job_contracts', function (Blueprint $table) {
            $table->renameColumn('dep_airport_id', 'dep_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'dep_airport_id')->after('id');
            $table->renameColumn('arr_airport_id', 'arr_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'arr_airport_id')->after('dep_airport_id');
        });

        $defaultAirportId = DB::table('airports')->where('identifier', 'AYMR')->value('id');
        DB::update('UPDATE community_job_contracts c JOIN airports ap ON c.dep_airport_identifier = ap.identifier SET c.dep_airport_id = ap.id WHERE c.dep_airport_identifier IS NOT NULL');
        DB::update('UPDATE community_job_contracts SET dep_airport_id = ? WHERE IFNULL(dep_airport_id,0) = 0', [$defaultAirportId]);
        DB::update('UPDATE community_job_contracts c JOIN airports ap ON c.arr_airport_identifier = ap.identifier SET c.arr_airport_id = ap.id WHERE c.arr_airport_identifier IS NOT NULL');
        DB::update('UPDATE community_job_contracts SET arr_airport_id = ? WHERE IFNULL(arr_airport_id,0) = 0', [$defaultAirportId]);

        Schema::table('community_job_contracts', function (Blueprint $table) {
            $table->dropColumn('dep_airport_identifier');
            $table->foreign('dep_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('arr_airport_identifier');
            $table->foreign('arr_airport_id')->references('id')->on('airports')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_job_contracts', function (Blueprint $table) {
            $table->string('dep_airport_identifier', 15)->nullable()->after('id');
            $table->string('arr_airport_identifier', 15)->nullable()->after('dep_airport_id');
        });

        DB::update('UPDATE community_job_contracts c JOIN airports ap ON c.dep_airport_id = ap.id SET c.dep_airport_identifier = ap.identifier WHERE c.dep_airport_id IS NOT NULL');
        DB::update('UPDATE community_job_contracts c JOIN airports ap ON c.arr_airport_id = ap.id SET c.arr_airport_identifier = ap.identifier WHERE c.arr_airport_id IS NOT NULL');

        Schema::table('community_job_contracts', function (Blueprint $table) {
            $table->dropForeign(['dep_airport_id']);
            $table->dropForeign(['arr_airport_id']);
            $table->dropColumn('dep_airport_id');
            $table->dropColumn('arr_airport_id');
        });

        Schema::table('community_job_contracts', function (Blueprint $table) {
            $table->renameColumn('dep_airport_identifier', 'dep_airport_id');
            $table->renameColumn('arr_airport_identifier', 'arr_airport_id');
        });
    }
};
