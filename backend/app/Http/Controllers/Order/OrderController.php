<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orderdetail;
use App\Models\Order;
use App\Enums\OrderStatus;
use App\Models\Product;
use App\Http\Requests\Order\StoreOrderRequest;

class OrderController extends Controller
{
    public function index(Request $request){

        $order = Order::with(['details', 'customer','createdBy','updatedBy'])
        ->orderBy("created_at","desc")
        ->paginate(8);
        return response()->json($order);
    }

  

    public function complete($id){
        $order = Order::with('details')->findOrFail($id); 
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found',
            ], 404);
        }
        
        $order->order_status = 1;  
        $order->updated_at = date('Y-m-d H:i:s');
        $order->save();
        return response()->json([
            'status' => true,
            'message' => 'Order has completed',
        ]);
    }

    public function cancel($id){
        $order = Order::findOrFail($id); 
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found',
            ], 404);
        }
        foreach ($order->details as $detail) {
            $product = Product::find($detail->product_id);
            if ($product) {
                $product->quantity += $detail->quantity;
                $product->save();
            }
        }
        $order->order_status = 2;  
        $order->updated_at = date('Y-m-d H:i:s');
        $order->save();
        return response()->json([
            'status' => true,
            'message' => 'Order has canceled',
        ]);
    } 

    public function show($id)
    {
        $order = Order::with(['details', 'customer','createdBy','updatedBy'])->find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        foreach ($order->details as $detail) {
            if ($detail->product && $detail->product->product_image) {
                $detail->product->product_image = asset('images/product/' . $detail->product->product_image);
            } else {
                $detail->product->product_image = null;
            }
        }
        return response()->json($order);
    }
    
    public function store(StoreOrderRequest $request)
    {
        // Calculate fields
        $total_products = 0;
        $sub_total = 0;
        $vat = 0;
        foreach ($request->products as $item) {
            $total_products += $item['quantity'];
            $sub_total += $item['quantity'] * $item['price'];
            $vat += $item['tax'] ?? 0;
        }
        $discount = $request->input('discount_percentage', 0) / 100 * $sub_total;
        $shipping = $request->input('shipping_amount', 0);
        $total = $sub_total + $vat + $shipping - $discount;

        // Payment info (get from request or set default)
        $pay = $request->input('pay', 0);
        $due = $total - $pay;
        $payment_type = $request->input('payment_type', 'cash');

        // Generate invoice number
        $invoice_no = 'INV-' . rand(1000000000, 9999999999);

        $order = new Order();
        $order->customer_id = $request->customer_id;
        $order->order_date = $request->date;
        $order->order_status = 0; // PENDING
        $order->total_products = $total_products;
        $order->sub_total = $sub_total;
        $order->vat = $vat;
        $order->total = $total;
        $order->invoice_no = $invoice_no;
        $order->payment_type = $payment_type;
        $order->pay = $pay;
        $order->due = $due;
        $order->created_by = auth()->id();

        $order->save();
        foreach ($request->products as $item) {
            $product = Product::findOrFail($item['product_id']);
            $orderDetail = new OrderDetail();
            $orderDetail->order_id = $order->id;
            $orderDetail->product_id = $product->id;
            $orderDetail->quantity = $item['quantity'];
            $orderDetail->unitcost = $item['price'];
            $orderDetail->total = $item['quantity'] * $item['price'];
            $orderDetail->save();
            $product->quantity -= $item['quantity'];
            $product->save();
        }
        // Optionally return the order
        return response()->json(['success' => true, 'order_id' => $order->id]);
    }
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'order not found'], 404);
        }
        $order->delete();
        return response()->json(['message' => 'order deleted successfully']);
    }

    public function search(Request $request)
    {
        $search = $request->query('q'); 
        \Log::debug($search);

        // Search for orders based on invoice number or customer name
        $orders = Order::with(['details', 'customer']) // Eager load the 'customer' relation
            ->where(function ($query) use ($search) {
                $query->where('invoice_no', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    });
            })
            ->paginate(10); // Paginate results, 10 per page

        // Return the results as a JSON response
        return response()->json($orders);
    }

}
