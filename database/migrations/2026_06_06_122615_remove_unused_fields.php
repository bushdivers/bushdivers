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
        Schema::table('fleets', function (Blueprint $table) {
            $table->dropColumn(['crew_required', 'cabin_crew_required']);
        });

        Schema::drop('staff');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fleets', function (Blueprint $table) {
            $table->string('crew_required')->after('number_of_engines');
            $table->string('cabin_crew_required')->after('crew_required');
        });

        DB::table('fleets')->update([
            'crew_required' => '1',
            'cabin_crew_required' => '0'
        ]);

        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->timestamps();
        });
    }
};
