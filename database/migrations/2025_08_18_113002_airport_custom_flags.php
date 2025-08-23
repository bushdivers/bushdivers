<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('airports',
            function (Blueprint $table) {
                $table->foreignId('user_id')->unique()->nullable()->after('identifier')->constrained('users')->restrictOnDelete();
                $table->boolean('is_thirdparty')->default(false)->after('user_id');
                $table->boolean('is_hub')->default(false)->change();
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('airports', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->dropColumn('is_thirdparty');
            }
        );
    }
};
