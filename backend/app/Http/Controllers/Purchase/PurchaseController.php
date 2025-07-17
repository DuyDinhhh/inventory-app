<?php

namespace App\Http\Controllers\Purchase;
use App\Models\Purchase;
use App\Models\Purchasedetail;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Purchase\StorePurchaseRequest;
use App\Http\Requests\Purchase\UpdatePurchaseRequest;
use App\Models\UserActivityLog;
class PurchaseController extends Controller
{
    public function index(){
        $purchase = Purchase::with(['supplier', 'purchaseDetails','createdBy','updatedBy'])
        ->orderBy("created_at","desc")
        ->paginate(8);
        return response()->json($purchase);
    }

    public function show($id){
        $purchase = Purchase::with(['supplier', 'purchaseDetails','createdBy','updatedBy'])
        ->findOrFail($id);
        foreach ($purchase->purchaseDetails as $detail) {
            if ($detail->product && $detail->product->product_image) {
                $detail->product->product_image = asset('images/product/' . $detail->product->product_image);
            } else {
                $detail->product->product_image = null;
            }
        }
        return response()->json($purchase);
    }

    public function store(StorePurchaseRequest $request){
       $purchase = new Purchase();
            $purchase->supplier_id = $request->supplier_id;
            // Save as date only (Y-m-d), not datetime
            $purchase->date = date('Y-m-d', strtotime($request->date));
            $purchase->purchase_no = $request->purchase_no;
            $purchase->status = 0;
            $purchase->total_amount = $request->total_amount;
            $purchase->created_by = auth()->id();
            $purchase->updated_by = null;
            $purchase->save();
            foreach ($request->products as $item) {
                $product = Product::findOrFail($item['product_id']);
                $detail = new PurchaseDetail();
                $detail->purchase_id = $purchase->id;
                $detail->product_id = $product->id;
                $detail->quantity = $item['quantity'];
                $detail->unitcost = $item['unitcost'];
                $detail->total = $item['total'];
                $detail->save();
     
        }
        $this->logActivity(
            auth()->id(),
            'create',
            [
                'purchase' => $purchase->purchase_no,
                'changes' => "Created a new purchase: " . $purchase->purchase_no,
            ],
            $purchase->id,
            Purchase::class
        );
        return response()->json(['success' => true, 'purchase_id' => $purchase->id]);
    }

    public function update(UpdatePurchaseRequest $request, $id){
   
        $purchase = Purchase::with(['supplier', 'purchaseDetails','createdBy'])
        ->findOrFail($id); 
        $oldValues = $purchase->getOriginal();

        $purchase->supplier_id = $request->supplier_id;
        $purchase->date = date('Y-m-d', strtotime($request->date));
        $purchase->purchase_no = $request->purchase_no;
        
        $purchase->total_amount = $request->total_amount;
        $purchase->updated_by = auth()->id();
        $purchase->save();

        // Add new details and adjust stock
        foreach ($request->products as $item) {
            $product = Product::findOrFail($item['product_id']);
            $detail = new PurchaseDetail();
            $detail->purchase_id = $purchase->id;
            $detail->product_id = $product->id;
            $detail->quantity = $item['quantity'];
            $detail->unitcost = $item['unitcost'];
            $detail->total = $item['total'];
            $detail->save();
        }
        $changes = UserActivityLog::logChanges($oldValues, $purchase->getAttributes());

        $this->logActivity(
            auth()->id(),
            'update',
            [
                'purchase' => $purchase->purchase_no,
                'changes' => $changes,
            ],
            $purchase->id,
            Purchase::class
        );
        return response()->json(['success' => true, 'purchase_id' => $purchase->id]);
    }
           
    public function approve($id){
        $purchase = Purchase::with('purchaseDetails')->findOrFail($id); 
        if (!$purchase) {
            return response()->json([
                'status' => false,
                'message' => 'Purchase not found',
            ], 404);
        }
    
        $product_changes = [];
        foreach ($purchase->purchaseDetails as $detail) {
            $product = Product::find($detail->product_id);
            if ($product) {
                $old_quantity = $product->quantity;
                $product->quantity += $detail->quantity;
                $product->save();
    
                $product_changes["product_{$product->name}_quantity"] = [
                    'product_name' => $product->name,
                    'old' => $old_quantity,
                    'new' => $product->quantity,
                    'added_amount' => $detail->quantity,
                ];
            }
        }
    
        $purchase->status = 1;  
        $purchase->updated_at = date('Y-m-d H:i:s');
        $purchase->save();
    
        $this->logActivity(
            auth()->id(),
            'approve',
            [
                'purchase' => $purchase->purchase_no,
                'changes' => array_merge(
                    ["Approved the purchase: " . $purchase->purchase_no],
                    $product_changes
                ),
            ],
            $purchase->id,
            Purchase::class
        );
        return response()->json([
            'status' => true,
            'message' => 'Purchase has completed',
        ]);
    }

    public function destroy($id)
    {
        $purchase = Purchase::findOrFail($id); 
        if (!$purchase) {
            return response()->json(['error' => 'Purchase not found'], 404);
        }
        $purchase->delete();
        $this->logActivity(
            auth()->id(),
            'delete',
            [
                'purchase' => $purchase->purchase_no,
                'changes' => "Deleted the purchase: " . $purchase->purchase_no,
            ],
            $purchase->id,
            Purchase::class
        );
        return response()->json(['message' => 'Purchase deleted successfully']);
    }


    public function search(Request $request)
    {
        $search = $request->query('q');   
        $purchases = Purchase::with('supplier')  // Include related supplier info
            ->where(function ($query) use ($search) {
                $query->where('purchase_no', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->paginate(10);  // Paginate the results

        return response()->json($purchases);
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