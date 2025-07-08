<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->date('order_date');
            $table->string('order_status', 20);
            $table->integer('total_products');
            $table->integer('sub_total');
            $table->integer('vat')->nullable();
            $table->integer('total');
            $table->string('invoice_no', 20)->unique();
            $table->string('payment_type', 20);
            $table->integer('pay');
            $table->integer('due');
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
}