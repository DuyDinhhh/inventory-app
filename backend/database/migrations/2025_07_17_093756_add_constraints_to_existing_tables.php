<?php

// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     /**
//      * Run the migrations.
//      */
//     public function up(): void
//     {
//         // Add foreign key constraints for the 'order_details' table
//         Schema::table('order_details', function (Blueprint $table) {
//             $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            
//             $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
//         });

//         Schema::table('orders', function (Blueprint $table) {
//             $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict');
//         });

//         // Add foreign key constraints for the 'purchases' table
//         Schema::table('purchases', function (Blueprint $table) {
//             $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict');
            
//             $table->foreign('created_by')->references('id')->on('users')->onDelete('restrict');
            
//             $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
//         });

//         // Add foreign key constraints for the 'purchase_details' table
//         Schema::table('purchase_details', function (Blueprint $table) {
//             $table->foreign('purchase_id')->references('id')->on('purchases')->onDelete('cascade');
            
//             $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
//         });
//     }

//     /**
//      * Reverse the migrations.
//      */
//     public function down(): void
//     {
//         // Drop foreign key constraints for 'order_details' table
//         Schema::table('order_details', function (Blueprint $table) {
//             $table->dropForeign(['order_id']);
//             $table->dropForeign(['product_id']);
//         });

//         // Drop foreign key constraints for 'orders' table
//         Schema::table('orders', function (Blueprint $table) {
//             $table->dropForeign(['customer_id']);
//         });

//         // No foreign key on 'products.id' in this migration

//         // Drop foreign key constraints for 'purchases' table
//         Schema::table('purchases', function (Blueprint $table) {
//             $table->dropForeign(['supplier_id']);
//             $table->dropForeign(['created_by']);
//             $table->dropForeign(['updated_by']);
//         });

//         // Drop foreign key constraints for 'purchase_details' table
//         Schema::table('purchase_details', function (Blueprint $table) {
//             $table->dropForeign(['purchase_id']);
//             $table->dropForeign(['product_id']);
//         });
//     }
// };