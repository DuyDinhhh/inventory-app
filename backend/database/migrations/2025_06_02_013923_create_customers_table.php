<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('email', 50)->nullable();
            $table->string('phone', 15)->nullable();
            $table->string('address', 100)->nullable();
            $table->string('photo', 50)->nullable();
            $table->string('account_holder', 50)->nullable();
            $table->string('account_number', 50)->nullable();
            $table->string('bank_name', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
}