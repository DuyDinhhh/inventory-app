<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('slug', 50)->unique();
            $table->string('code', 20)->unique();
            $table->integer('quantity')->default(0);
            $table->integer('quantity_alert')->default(0);
            $table->integer('buying_price');
            $table->integer('selling_price');
            $table->decimal('tax', 10, 2)->nullable();
            $table->string('tax_type', 20)->nullable();
            $table->text('notes')->nullable();
            $table->string('product_image', 100)->nullable();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('unit_id');
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('restrict');
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
}