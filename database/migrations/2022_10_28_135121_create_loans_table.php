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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->decimal('loan_amount');
            $table->decimal('total_interest');
            $table->decimal('total_remaining');
            $table->integer('term_months');
            $table->integer('term_remaining');
            $table->decimal('monthly_payment');
            $table->integer('missed_payments');
            $table->dateTime('last_payment_at')->nullable();
            $table->dateTime('next_payment_at')->nullable();
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
        Schema::dropIfExists('loans');
    }
};
