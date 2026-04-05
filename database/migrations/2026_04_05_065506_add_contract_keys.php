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
        Schema::table('contracts', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            //$table->foreign('contract_type_id')->references('id')->on('contract_types')->onDelete('restrict');
            // Could foreign key, but Laravel enum probably better
            // IDs must be stable since they're referenced in code
            $table->index('contract_type_id');
        });

        Schema::table('community_job_contracts', function (Blueprint $table) {
            $table->foreign('community_job_id')->references('id')->on('community_jobs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex('contracts_user_id_foreign');

            //$table->dropForeign(['contract_type_id']);
            //$table->dropIndex('contracts_contract_type_id_foreign');
            $table->dropIndex(['contract_type_id']);
        });

        Schema::table('community_job_contracts', function (Blueprint $table) {
            $table->dropForeign(['community_job_id']);
            $table->dropIndex('community_job_contracts_community_job_id_foreign');
        });
    }
};
