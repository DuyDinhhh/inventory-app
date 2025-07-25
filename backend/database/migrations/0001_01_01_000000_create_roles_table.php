<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id('role_id'); // primary key for roles
            $table->string('role_name');
            $table->string('permission_name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });
         
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
};
