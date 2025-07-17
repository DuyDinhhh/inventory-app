<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orderdetail;
use App\Models\Order;
use App\Enums\OrderStatus;
use App\Models\Product;
use App\Http\Requests\Order\StoreOrderRequest;
use Carbon\Carbon;
use App\Models\UserActivityLog;

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

        $this->logActivity(
            auth()->id(),
            'complete',
            [
                'order' => $order->invoice_no,
                'changes' => "Completed the order: " . $order->invoice_no,
            ],
            $order->id,
            Order::class
        );
        return response()->json([
            'status' => true,
            'message' => 'Order has completed',
        ]);
    }

    public function return($id){
        $order = Order::with('details')->findOrFail($id); 
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found',
            ], 404);
        }
    
        $product_changes = [];
        foreach ($order->details as $detail) {
            $product = Product::find($detail->product_id);
            if ($product) {
                $old_quantity = $product->quantity;
                $product->quantity += $detail->quantity;
                $product->save();
    
                $product_changes["product_{$product->name}_quantity"] = [
                    'product_name' => $product->name,
                    'old' => $old_quantity,
                    'new' => $product->quantity,
                    'returned_amount' => $detail->quantity,
                ];
            }
        }
    
        $order->order_status = 3;  
        $order->updated_at = date('Y-m-d H:i:s');
        $order->save();
    
        $this->logActivity(
            auth()->id(),
            'return',
            [
                'order' => $order->invoice_no,
                'changes' => array_merge(
                    ["Returned the order: " . $order->invoice_no],
                    $product_changes
                ),
            ],
            $order->id,
            Order::class
        );
    
        return response()->json([
            'status' => true,
            'message' => 'Order has completed',
        ]);
    }
    
    public function cancel($id){
        $order = Order::with('details')->findOrFail($id); 
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found',
            ], 404);
        }
    
        $product_changes = [];
        foreach ($order->details as $detail) {
            $product = Product::find($detail->product_id);
            if ($product) {
                $old_quantity = $product->quantity;
                $product->quantity += $detail->quantity;
                $product->save();
    
                $product_changes["product_{$product->name}_quantity"] = [
                    'product_name' => $product->name,
                    'old' => $old_quantity,
                    'new' => $product->quantity,
                    'returned_amount' => $detail->quantity,
                ];
            }
        }
        $order->order_status = 2;  
        $order->updated_at = date('Y-m-d H:i:s');
        $order->save();
    
        $this->logActivity(
            auth()->id(),
            'cancel',
            [
                'order' => $order->invoice_no,
                'changes' => array_merge(
                    ["Canceled the order: " . $order->invoice_no],
                    $product_changes
                ),
            ],
            $order->id,
            Order::class
        );
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

        $pay = $request->input('pay', 0);
        $due = $total - $pay;
        $payment_type = $request->input('payment_type', 'cash');

        // Generate invoice number
        $invoice_no = 'INV-' . rand(1000000000, 9999999999);

        $order = new Order();
        $order->customer_id = $request->customer_id;
        $order->order_date =  Carbon::parse($request->date)
            ->setTimezone('Asia/Ho_Chi_Minh')
            ->format('Y-m-d H:i:s');
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
        $product_changes = [];
        $out_of_stock_products = [];

        foreach ($request->products as $item) {
            $product = Product::findOrFail($item['product_id']);
            $old_quantity = $product->quantity;

            // Check for out of stock before deduction
            if ($old_quantity < $item['quantity']) {
                $out_of_stock_products[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'available' => $old_quantity,
                    'required' => $item['quantity']
                ];
                continue;
            }

            $orderDetail = new OrderDetail();
            $orderDetail->order_id = $order->id;
            $orderDetail->product_id = $product->id;
            $orderDetail->quantity = $item['quantity'];
            $orderDetail->unitcost = $item['price'];
            $orderDetail->total = $item['quantity'] * $item['price'];
            $orderDetail->save();

            $product->quantity -= $item['quantity'];
            $product->save();

            $product_changes["product_{$product->name}_quantity"] = [
                'product_name' => $product->name,
                'old' => $old_quantity,
                'new' => $product->quantity,
                'changed_amount' => $item['quantity'],
                'out_of_stock' => $product->quantity <= 0 ? true : false,
            ];
        }

        // If any product is out of stock, respond with error and do not proceed
        if (count($out_of_stock_products) > 0) {
            // Rollback order if needed (optional: delete order/details)
            $order->delete();
            return response()->json([
                'success' => false,
                'message' => 'Some products are out of stock.',
                'out_of_stock' => $out_of_stock_products
            ], 422);
        }

        $this->logActivity(
            auth()->id(),
            'create',
            [
                'order' => $order->invoice_no,
                'changes' => array_merge(
                    [
                        "Created a new order: " . $order->invoice_no,
                    ],
                    $product_changes
                ),
            ],
            $order->id,
            Order::class
        );

        return response()->json(['success' => true, 'order_id' => $order->id]);
    }
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'order not found'], 404);
        }
        $order->delete();
        $this->logActivity(
            auth()->id(),
            'delete',
            [
                'order' => $order->invoice_no,
                'changes' => "Deleted the order: " . $order->invoice_no,
            ],
            $order->id,
            Order::class
        );
        return response()->json(['message' => 'order deleted successfully']);
    }

    public function search(Request $request)
    {
        $search = $request->query('q'); 
 
        // Search for orders based on invoice number or customer name
        $orders = Order::with(['details', 'customer']) 
            ->where(function ($query) use ($search) {
                $query->where('invoice_no', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    });
            })
            ->paginate(10);
        return response()->json($orders);
    }
    private function logActivity($userId, $action, array $details, $loggableId, $loggableType)
    {
        UserActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'details' => json_encode($details),
            'loggable_id' => $loggableId,
            'loggable_type' => $loggableType,
        ]);
    }
  

}
