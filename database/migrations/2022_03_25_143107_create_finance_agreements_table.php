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
            $table->decimal('deposit', 10)->default(0.00);
            $table->decimal('finance_amount', 10, 2);
            $table->integer('term_months');
            $table->decimal('monthly_payments', 10, 2);
            $table->decimal('amount_remaining', 10, 2);
            $table->integer('term_remaining');
            $table->integer('missed_payments');
            $table->dateTime('last_payment_at')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->boolean('is_active')->default(true);
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
