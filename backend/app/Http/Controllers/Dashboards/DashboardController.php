<?php

namespace App\Http\Controllers\Dashboards;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Purchase;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Get total counts
        $totalProducts = Product::count();
        $totalCustomers = Customer::count();
        $totalOrders = Order::count();
        $totalPurchases = Purchase::count();

        // Get today's counts
        $today = Carbon::today();
        $totalOrdersToday = Order::whereDate('created_at', $today)->count();
        $totalPurchasesToday = Purchase::whereDate('created_at', $today)->count();

        return response()->json([
            'total_products' => $totalProducts,
            'total_customers' => $totalCustomers,
            'total_orders' => $totalOrders,
            'total_orders_today' => $totalOrdersToday,
            'total_purchases' => $totalPurchases,
            'total_purchases_today' => $totalPurchasesToday,
        ]);
    }
}