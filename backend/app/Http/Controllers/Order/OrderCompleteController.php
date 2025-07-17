<?php

namespace App\Http\Controllers\Order;
use App\Models\Order;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserActivityLog;
class OrderCompleteController extends Controller
{
    public function completeOrders(Request $request){
        $order = Order::with(['details', 'customer','createdBy','updatedBy'])
        ->orderBy("created_at","desc")
        ->where('order_status', OrderStatus::COMPLETE)        
        ->paginate(8);
        return response()->json($order);
    }

    public function returnOrders(Request $request){
        $order = Order::with(['details', 'customer','createdBy','updatedBy'])
        ->orderBy("created_at","desc")
        ->where('order_status', OrderStatus::RETURN)        
        ->paginate(8);
        return response()->json($order);
    }
}
