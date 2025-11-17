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
        // Validate can migrate prior to starting
        // Check tour_checkpoints and tour_checkpoint_users do not have unknown airport identifiers
        $invalidRows = DB::table('tour_checkpoints as tc')
            ->leftJoin('airports as ap', 'tc.checkpoint', '=', 'ap.identifier')
            ->whereNull('ap.id')
            ->select('tc.checkpoint')
            ->count();
        if ($invalidRows > 0)
            throw new \Exception("Cannot migrate tour_checkpoints table as it contains invalid airport identifiers.");

        $invalidRows = DB::table('tour_checkpoint_users as tcu')
            ->leftJoin('airports as ap', 'tcu.checkpoint', '=', 'ap.identifier')
            ->whereNull('ap.id')
            ->select('tcu.id')
            ->count();
        if ($invalidRows > 0)
            throw new \Exception("Cannot migrate tour_checkpoint_users table as it contains invalid airport identifiers.");

        $invalidRows = DB::table('tours')
            ->leftJoin('airports as ap', 'tours.start_airport_id', '=', 'ap.identifier')
            ->whereNull('ap.id')
            ->select('tours.id')
            ->count();
        if ($invalidRows > 0)
            throw new \Exception("Cannot migrate tours table as it contains invalid start_airport_id airport identifiers.");

        $invalidRows = DB::table('tour_users as tu')
            ->leftJoin('airports as ap', 'tu.next_checkpoint', '=', 'ap.identifier')
            ->whereNull('ap.id')
            ->select('tu.id')
            ->count();
        if ($invalidRows > 0)
            throw new \Exception("Cannot migrate tour_users table as it contains invalid next_checkpoint airport identifiers.");

        // Checkpoints
        Schema::table('tour_checkpoints', function (Blueprint $table) {
            $table->foreignIdFor(\App\Models\Airport::class, 'checkpoint_airport_id')->after('checkpoint');
        });

        DB::update('UPDATE tour_checkpoints tc JOIN airports ap ON tc.checkpoint = ap.identifier SET tc.checkpoint_airport_id = ap.id WHERE tc.checkpoint IS NOT NULL');

        Schema::table('tour_checkpoints', function (Blueprint $table) {
            $table->foreign('checkpoint_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('checkpoint');
        });

        // Checkpoint Users
        Schema::table('tour_checkpoint_users', function (Blueprint $table) {
            $table->foreignIdFor(\App\Models\Airport::class, 'checkpoint_airport_id')->after('checkpoint');
        });

        DB::update('UPDATE tour_checkpoint_users tcu JOIN airports ap ON tcu.checkpoint = ap.identifier SET tcu.checkpoint_airport_id = ap.id WHERE tcu.checkpoint IS NOT NULL');
        Schema::table('tour_checkpoint_users', function (Blueprint $table) {
            $table->foreign('checkpoint_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('checkpoint');
        });

        // Tours
        Schema::table('tours', function (Blueprint $table) {
            $table->renameColumn('start_airport_id', 'start_airport_identifier');
            $table->foreignIdFor(\App\Models\Airport::class, 'start_airport_id')->after('id');
        });
        DB::update('UPDATE tours t JOIN airports ap ON t.start_airport_identifier = ap.identifier SET t.start_airport_id = ap.id WHERE t.start_airport_identifier IS NOT NULL');
        Schema::table('tours', function (Blueprint $table) {
            $table->foreign('start_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('start_airport_identifier');
        });

        // Tour Users
        Schema::table('tour_users', function (Blueprint $table) {
            $table->foreignIdFor(\App\Models\Airport::class, 'next_airport_id')->after('tour_id');
        });
        DB::update('UPDATE tour_users tu JOIN airports ap ON tu.next_checkpoint = ap.identifier SET tu.next_airport_id = ap.id WHERE tu.next_airport_id IS NOT NULL');
        Schema::table('tour_users', function (Blueprint $table) {
            $table->foreign('next_airport_id')->references('id')->on('airports')->restrictOnDelete();
            $table->dropColumn('next_checkpoint');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tour_checkpoint_users', function (Blueprint $table) {
            $table->string('checkpoint', 15)->nullable()->after('checkpoint_airport_id');
        });
        DB::update('UPDATE tour_checkpoint_users tcu JOIN airports ap ON tcu.checkpoint_airport_id = ap.id SET tcu.checkpoint = ap.identifier WHERE tcu.checkpoint_airport_id IS NOT NULL');
        Schema::table('tour_checkpoint_users', function (Blueprint $table) {
            $table->dropForeign(['checkpoint_airport_id']);
            $table->dropColumn('checkpoint_airport_id');
        });

        Schema::table('tour_checkpoints', function (Blueprint $table) {
            $table->string('checkpoint', 15)->nullable()->after('checkpoint_airport_id');
        });
        DB::update('UPDATE tour_checkpoints tc JOIN airports ap ON tc.checkpoint_airport_id = ap.id SET tc.checkpoint = ap.identifier WHERE tc.checkpoint_airport_id IS NOT NULL');
        Schema::table('tour_checkpoints', function (Blueprint $table) {
            $table->dropForeign(['checkpoint_airport_id']);
            $table->dropColumn('checkpoint_airport_id');
        });

        Schema::table('tours', function (Blueprint $table) {
            $table->string('start_airport_identifier', 15)->nullable()->after('id');
        });
        DB::update('UPDATE tours t JOIN airports ap ON t.start_airport_id = ap.id SET t.start_airport_identifier = ap.identifier WHERE t.start_airport_id IS NOT NULL');
        Schema::table('tours', function (Blueprint $table) {
            $table->dropForeign(['start_airport_id']);
            $table->dropColumn('start_airport_id');
        });
        Schema::table('tours', function (Blueprint $table) {
            $table->renameColumn('start_airport_identifier', 'start_airport_id');
        });

        Schema::table('tour_users', function (Blueprint $table) {
            $table->string('next_checkpoint', 15)->nullable()->after('tour_id');
        });
        DB::update('UPDATE tour_users tu JOIN airports ap ON tu.next_airport_id = ap.id SET tu.next_checkpoint = ap.identifier WHERE tu.next_airport_id IS NOT NULL');
        Schema::table('tour_users', function (Blueprint $table) {
            $table->dropForeign(['next_airport_id']);
            $table->dropColumn('next_airport_id');
        });
    }
};
