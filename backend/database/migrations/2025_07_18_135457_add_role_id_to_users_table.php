<?php

// database/migrations/xxxx_xx_xx_xxxxxx_add_role_id_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleIdToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id')->nullable(); // add role_id column
            $table->foreign('role_id')->references('role_id')->on('roles')->onDelete('set null'); // foreign key constraint
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']); // drop foreign key constraint
            $table->dropColumn('role_id'); // drop role_id column
        });
    }
}
