<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_activity_logs', function (Blueprint $table) {
            $table->id();  // Auto-incrementing primary key for the log entry
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Reference to the user who performed the action
            $table->string('action'); // Action performed (e.g., 'create', 'update', 'delete')
            $table->text('details'); // Details about the action (old/new values)
            $table->morphs('loggable'); // Polymorphic relationship to any model (e.g., Category, Product)
            $table->timestamps(); // Created_at and updated_at fields
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_activity_logs');
    }
};
 
