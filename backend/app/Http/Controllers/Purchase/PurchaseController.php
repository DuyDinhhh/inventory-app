<?php

namespace App\Http\Controllers\Purchase;
use App\Models\Purchase;
use App\Models\Purchasedetail;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Purchase\StorePurchaseRequest;
use App\Http\Requests\Purchase\UpdatePurchaseRequest;

class PurchaseController extends Controller
{
    public function index(){
        $purchase = Purchase::with(['supplier', 'purchaseDetails'])
        ->orderBy("created_at","desc")
        ->get();
        return response()->json($purchase);
    }

    public function show($id){
        $purchase = Purchase::with(['supplier', 'purchaseDetails','createdBy'])
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

                $product->quantity += $item['quantity'];
                $product->save();
        }
        return response()->json(['success' => true, 'purchase_id' => $purchase->id]);
    }

    public function update(UpdatePurchaseRequest $request, $id){
   
        $purchase = Purchase::with(['supplier', 'purchaseDetails','createdBy'])
        ->findOrFail($id); 
        // Restore stock for previous purchase details
        foreach ($purchase->purchaseDetails as $oldDetail) {
            $product = Product::find($oldDetail->product_id);
            if ($product) {
                $product->quantity -= $oldDetail->quantity;
                $product->save();
            }
        }
        // Delete old purchase details
        $purchase->purchaseDetails()->delete();
        // Update purchase main info
        $purchase->supplier_id = $request->supplier_id;
        $purchase->date = date('Y-m-d', strtotime($request->date));
        $purchase->purchase_no = $request->purchase_no;
        // $purchase->status = $purchase->status ?? 0;
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

            $product->quantity += $item['quantity'];
            $product->save();
        }

        return response()->json(['success' => true, 'purchase_id' => $purchase->id]);
    }


    public function approve($id){
        $purchase = Purchase::findOrFail($id); 
        if (!$purchase) {
            return response()->json([
                'status' => false,
                'message' => 'Purchase not found',
            ], 404);
        }
        $purchase->status = 1;  
        $purchase->updated_at = date('Y-m-d H:i:s');
        $purchase->save();
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
        return response()->json(['message' => 'Purchase deleted successfully']);
    }
}