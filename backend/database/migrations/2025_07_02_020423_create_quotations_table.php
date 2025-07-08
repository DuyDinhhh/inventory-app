<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotationsTable extends Migration
{
    public function up(): void
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('reference', 30)->unique();
            $table->unsignedBigInteger('customer_id');
            $table->string('customer_name', 50)->nullable();
            $table->decimal('tax_percentage', 5, 2)->nullable();
            $table->integer('tax_amount')->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->integer('discount_amount')->nullable();
            $table->integer('shipping_amount')->nullable();
            $table->integer('total_amount');
            $table->string('status', 20);
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
}