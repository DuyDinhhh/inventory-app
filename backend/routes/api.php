<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Dashboards\DashboardController;

use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductExportController;
use App\Http\Controllers\Product\ProductImportController;

use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Order\OrderCompleteController;
use App\Http\Controllers\Order\OrderPendingController;

use App\Http\Controllers\Purchase\PurchaseController;
use App\Http\Controllers\Purchase\PurchaseApproveController;
use App\Http\Controllers\Purchase\PurchasePendingController;


use App\Http\Controllers\Supplier\SupplierController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Unit\UnitController;
use App\Http\Controllers\User\UserController;

Route::get('/', function () {
    return response()->json(['message' => 'Hello world!']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Route::post('product/import', [ProductImportController::class, 'import']);

Route::post('/product/import/preview', [ProductImportController::class, 'preview']);
Route::post('/product/import/confirm', [ProductImportController::class, 'confirm']);
Route::middleware('jwt')->group(function () {
    // Route::get('/user', [AuthController::class, 'getUser']);
    Route::put('/user', [AuthController::class, 'updateUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/products', [ProductController::class, 'index']);

    Route::prefix('product')->group(function () {
        Route::get('/search', [ProductController::class, 'search']);
        Route::post('/import', [ProductImportController::class, 'import']);
        Route::get('/export', [ProductExportController::class, 'export']);
        Route::get('/list', [ProductController::class, 'list']);
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/{id}', [ProductController::class, 'show']);
        Route::post('/', [ProductController::class, 'store']);
        Route::post('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });
    
    Route::prefix('order')->group(function () {
        Route::get('/search', [OrderController::class, 'search']);
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/pendingOrders', [OrderPendingController::class, 'pendingOrders']);
        Route::get('/completeOrders', [OrderCompleteController::class, 'completeOrders']);
        Route::put('/complete/{id}', [OrderController::class, 'complete']);
        Route::put('/cancel/{id}', [OrderController::class, 'cancel']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::post('/', [OrderController::class, 'store']);
        Route::post('/{id}', [OrderController::class, 'update']);
        Route::delete('/{id}', [OrderController::class, 'destroy']);
    });
 
    Route::prefix('purchase')->group(function () {
        Route::get('/search', [PurchaseController::class, 'search']);
        Route::get('/', [PurchaseController::class, 'index']);
        Route::get('/approvePurchases', [PurchaseApproveController::class, 'approvePurchases']);
        Route::get('/pendingPurchases', [PurchasePendingController::class, 'pendingPurchases']);
        Route::put('/approve/{id}', [PurchaseController::class, 'approve']);
        Route::get('/{id}', [PurchaseController::class, 'show']);
        Route::post('/', [PurchaseController::class, 'store']);
        Route::post('/{id}', [PurchaseController::class, 'update']);
        Route::delete('/{id}', [PurchaseController::class, 'destroy']);
    });

    Route::prefix('supplier')->group(function () {
        Route::get('/search', [SupplierController::class, 'search']);
        Route::get('/', [SupplierController::class, 'index']);
        Route::get('/{id}', [SupplierController::class, 'show']);
        Route::post('/', [SupplierController::class, 'store']);
        Route::post('/{id}', [SupplierController::class, 'update']);
        Route::delete('/{id}', [SupplierController::class, 'destroy']);
    });

    Route::prefix('customer')->group(function () {
        Route::get('/search', [CustomerController::class, 'search']);
        Route::get('/', [CustomerController::class, 'index']);
        Route::get('/{id}', [CustomerController::class, 'show']);
        Route::post('/', [CustomerController::class, 'store']);
        Route::post('/{id}', [CustomerController::class, 'update']);
        Route::delete('/{id}', [CustomerController::class, 'destroy']);
    });

    Route::prefix('category')->group(function () {
        Route::get('/search', [CategoryController::class, 'search']);
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::post('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    Route::prefix('unit')->group(function () {
        Route::get('/search', [UnitController::class, 'search']);
        Route::get('/', [UnitController::class, 'index']);
        Route::get('/{id}', [UnitController::class, 'show']);
        Route::post('/', [UnitController::class, 'store']);
        Route::post('/{id}', [UnitController::class, 'update']);
        Route::delete('/{id}', [UnitController::class, 'destroy']);
    });

    Route::prefix('user')->group(function () {
        Route::get('/search', [UserController::class, 'search']);
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store']);
        Route::post('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    Route::prefix('/dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
        Route::get('/barchart', [DashboardController::class, 'barChartProductStock']);
        Route::get('/saleTrendOverTime', [DashboardController::class, 'saleTrendOverTime']);
        Route::get('/purchaseTrendOverTime', [DashboardController::class, 'purchaseTrendOverTime']);
    });
    
});