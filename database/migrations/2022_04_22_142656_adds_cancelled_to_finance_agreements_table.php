<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('finance_agreements', function (Blueprint $table) {
            $table->boolean('is_cancelled')->default(false);
            $table->dateTime('cancelled_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('finance_agreements', function (Blueprint $table) {
            $table->dropColumn('is_cancelled', 'cancelled_at');
        });
    }
};
