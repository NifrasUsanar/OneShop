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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('sale_type')->default('sale');
            $table->string('invoice_number')->nullable()->unique();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('contact_id');
            $table->date('sale_date'); // Sale date
            $table->decimal('total_amount', 10, 2); //Net total (total after discount)
            $table->decimal('discount', 10, 2)->default(0); // Discount
            $table->decimal('amount_received', 10, 2); // Amount received
            $table->decimal('profit_amount', 10, 2)->default(0);
            $table->string('status')->default('pending'); //['completed', 'pending', 'refunded']
            $table->string('payment_status')->default('pending');
            $table->text('note')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('store_id')->references('id')->on('stores');
            $table->foreign('contact_id')->references('id')->on('contacts');
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
