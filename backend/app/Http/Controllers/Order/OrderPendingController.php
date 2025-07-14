<?php

namespace App\Http\Controllers\Order;
use App\Models\Order;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderPendingController extends Controller
{
    public function pendingOrders(Request $request){

        $order = Order::with(['details', 'customer','createdBy','updatedBy'])
        ->orderBy("created_at","desc")
        ->where('order_status', OrderStatus::PENDING)        
        ->paginate(8);
        return response()->json($order);
    }
}
