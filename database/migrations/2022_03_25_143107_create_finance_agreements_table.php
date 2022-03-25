<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFinanceAgreementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('finance_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('aircraft_id');
            $table->float('deposit')->default(0.00);
            $table->float('finance_amount');
            $table->integer('term_months');
            $table->float('monthly_payments');
            $table->float('amount_remaining');
            $table->integer('term_remaining');
            $table->integer('missed_payments');
            $table->dateTime('last_payment_at')->default(null);
            $table->boolean('is_paid')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('finance_agreements');
    }
}
