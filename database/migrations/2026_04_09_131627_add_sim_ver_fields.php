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
        Schema::table('airports', function (Blueprint $table) {
            $table->json('sim_type')->nullable()->after('name');
        });

        Schema::table('fleet_variants', function (Blueprint $table) {
            $table->json('sim_type')->nullable()->after('name');
        });

        Schema::table('uploads', function (Blueprint $table) {
            $table->string('author')->nullable()->after('display_name');
            $table->json('sim_type')->nullable()->after('upload_type');
            $table->string('disk')->nullable()->after('sim_type');
            $table->integer('size')->nullable()->change();
        });

        DB::table('uploads')->whereNotNull('url')->update(['disk' => 's3']);
        DB::table('airports')->update(['sim_type' => '["fs20","fs24"]']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('airports', function (Blueprint $table) {
            $table->dropColumn('sim_type');
        });

        Schema::table('fleet_variants', function (Blueprint $table) {
            $table->dropColumn('sim_type');
        });

        Schema::table('uploads', function (Blueprint $table) {
            $table->dropColumn('sim_type');
            $table->dropColumn('author');
            $table->dropColumn('disk');
            $table->integer('size')->nullable(false)->change();
        });
    }
};
