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
        $invalidRows = DB::table('fleets as f')
            ->leftJoin('airports as a', 'f.hq', '=', 'a.identifier')
            ->whereNull('a.id')
            ->select('f.id')
            ->count();
        if ($invalidRows > 0)
            throw new \Exception("Cannot migrate fleets table as it contains invalid hq airport identifiers.");

        Schema::table('fleets', function (Blueprint $table) {
            $table->foreignId('hq_airport_id')->nullable()->after('manufacturer_id');
        });

        DB::statement('UPDATE fleets f JOIN airports a ON f.hq = a.identifier SET f.hq_airport_id = a.id');

        Schema::table('fleets', function (Blueprint $table) {
            $table->foreign('hq_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->foreignId('hq_airport_id')->nullable(false)->change();
            $table->dropColumn('hq');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fleets', function (Blueprint $table) {
            $table->string('hq')->nullable()->after('manufacturer_id');
        });

        DB::statement('UPDATE fleets f JOIN airports a ON f.hq_airport_id = a.id SET f.hq = a.identifier');

        Schema::table('fleets', function (Blueprint $table) {
            $table->dropForeign(['hq_airport_id']);
            $table->dropColumn('hq_airport_id');
        });
    }
};
