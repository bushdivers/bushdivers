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
        Schema::table('rentals', function (Blueprint $table) {
            $table->renameColumn('current_airport_id', 'current_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'current_airport_id')->after('fleet_id');

            $table->renameColumn('rental_airport_id', 'rental_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'rental_airport_id')->after('current_airport_id');
        });

        $defaultAirportId = DB::table('airports')->where('identifier', 'AYMR')->value('id');
        DB::update('UPDATE rentals r JOIN airports ap ON r.current_airport_identifier = ap.identifier SET r.current_airport_id = ap.id WHERE r.current_airport_identifier IS NOT NULL');
        DB::update('UPDATE rentals SET current_airport_id = ? WHERE IFNULL(current_airport_id,0) = 0', [$defaultAirportId]);
        DB::update('UPDATE rentals r JOIN airports ap ON r.rental_airport_identifier = ap.identifier SET r.rental_airport_id = ap.id WHERE r.rental_airport_identifier IS NOT NULL');
        DB::update('UPDATE rentals SET rental_airport_id = ? WHERE IFNULL(rental_airport_id,0) = 0', [$defaultAirportId]);

        Schema::table('rentals', function (Blueprint $table) {
            $table->dropColumn('current_airport_identifier');
            $table->foreign('current_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('rental_airport_identifier');
            $table->foreign('rental_airport_id')->references('id')->on('airports')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->string('current_airport_identifier', 15)->nullable()->after('fleet_id');
            $table->string('rental_airport_identifier', 15)->nullable()->after('current_airport_id');
        });

        DB::update('UPDATE rentals r JOIN airports ap ON r.current_airport_id = ap.id SET r.current_airport_identifier = ap.identifier WHERE r.current_airport_id IS NOT NULL');
        DB::update('UPDATE rentals r JOIN airports ap ON r.rental_airport_id = ap.id SET r.rental_airport_identifier = ap.identifier WHERE r.rental_airport_id IS NOT NULL');

        Schema::table('rentals', function (Blueprint $table) {
            $table->dropForeign(['current_airport_id']);
            $table->dropForeign(['rental_airport_id']);
            $table->dropColumn('current_airport_id');
            $table->dropColumn('rental_airport_id');
        });

        Schema::table('rentals', function (Blueprint $table) {
            $table->renameColumn('current_airport_identifier', 'current_airport_id');
            $table->renameColumn('rental_airport_identifier', 'rental_airport_id');
        });
    }
};
