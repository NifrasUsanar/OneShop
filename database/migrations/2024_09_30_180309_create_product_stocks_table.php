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
        Schema::create('product_stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id'); // Foreign key for the store
            $table->unsignedBigInteger('product_id')->nullable();// Foreign key for the store
            $table->unsignedBigInteger('batch_id'); // Foreign key for the product batch
            $table->decimal('quantity', 10, 2)->default(0.00); // Quantity of stock available (decimal type)
            $table->integer('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('store_id')->references('id')->on('stores');
            $table->foreign('batch_id')->references('id')->on('product_batches');
            $table->foreign('product_id')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_stocks');
    }
};
