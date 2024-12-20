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
        Schema::create('product_batches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id'); // Using unsignedInteger for product_id
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->string('batch_number')->default('DEFAULT'); // Default batch code
            $table->date('expiry_date')->nullable(); // Nullable expiry date
            $table->decimal('cost', 10, 2); // Cost price
            $table->decimal('price', 10, 2); // Sale price
            $table->decimal('discount',10)->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('contact_id')->references('id')->on('contacts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_batches');
    }
};
