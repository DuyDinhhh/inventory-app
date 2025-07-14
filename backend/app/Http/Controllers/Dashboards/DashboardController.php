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
    public function barChartProductStock(){
        $products = Product::with(['category', 'unit','createdBy','updatedBy'])->orderBy('created_at','desc')->get();
        foreach ($products as $product) {
            if ($product->product_image) {
                $product->product_image = asset('images/product/' . $product->product_image);
            } else {
                $product->product_image = null;
            }
        } 
        return response()->json($products);
    }

    public function saleTrendOverTime(){
        $orders = Order::with('details')->orderBy('created_at','desc')->get();
        return response()->json($orders);
    }

    public function purchaseTrendOverTime(){
        $purchases = Purchase::with('purchaseDetails')->orderBy('created_at','desc')->get();
        return response()->json($purchases);
    }
}