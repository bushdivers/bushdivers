<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::update('UPDATE pireps p JOIN airports a ON a.identifier = p.departure_airport_id '
                   . 'SET p.departure_airport_fk_id = a.id '
                   . 'WHERE p.departure_airport_fk_id IS NULL');
        DB::update('UPDATE pireps p JOIN airports a ON a.identifier = p.destination_airport_id '
                   . 'SET p.arrival_airport_fk_id = a.id '
                   . 'WHERE p.arrival_airport_fk_id IS NULL');

        Schema::table('pireps', function (Blueprint $table) {
            // Rename temp columns
            $table->renameColumn('departure_airport_id', 'departure_airport_identifier');
            $table->renameColumn('destination_airport_id', 'destination_airport_identifier');

            $table->renameColumn('departure_airport_fk_id', 'departure_airport_id');
            $table->renameColumn('arrival_airport_fk_id', 'arrival_airport_id');
        });

        // Set not null on arrival
        Schema::table('pireps', function (Blueprint $table) {
            $table->unsignedBigInteger('arrival_airport_id')->nullable(false)->change();
        });

        Schema::table('pireps', function (Blueprint $table) {
            $table->foreign('departure_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->foreign('arrival_airport_id')->references('id')->on('airports')->restrictOnDelete();
        });

        Schema::table('pireps', function (Blueprint $table) {
            $table->dropColumn('departure_airport_identifier');
            $table->dropColumn('destination_airport_identifier');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pireps', function (Blueprint $table) {
            $table->string('departure_airport_identifier')->after('aircraft_id');
            $table->string('destination_airport_identifier')->after('departure_airport_identifier');
        });

        DB::update('UPDATE pireps p SET departure_airport_identifier = (SELECT identifier FROM airports a WHERE a.id = p.departure_airport_id)');
        DB::update('UPDATE pireps p SET destination_airport_identifier = (SELECT identifier FROM airports a WHERE a.id = p.arrival_airport_id)');

        // Drop foreign keys
        Schema::table('pireps', function (Blueprint $table) {
            $table->dropForeign(['departure_airport_id']);
            $table->dropForeign(['arrival_airport_id']);
        });

        Schema::table('pireps', function (Blueprint $table) {
            $table->renameColumn('departure_airport_id', 'departure_airport_fk_id');
            $table->renameColumn('arrival_airport_id', 'arrival_airport_fk_id');
            $table->renameColumn('departure_airport_identifier', 'departure_airport_id');
            $table->renameColumn('destination_airport_identifier', 'destination_airport_id');
        });
    }
};
