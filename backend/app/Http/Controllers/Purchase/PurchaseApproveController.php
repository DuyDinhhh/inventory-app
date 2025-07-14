<?php

namespace App\Http\Controllers\Purchase;
use App\Models\Purchase;
use App\Enums\PurchaseStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PurchaseApproveController extends Controller
{
    public function approvePurchases(){
        $purchase = Purchase::with(['supplier', 'purchaseDetails','createdBy','updatedBy'])
        ->orderBy("created_at","desc")
        ->where('status', PurchaseStatus::APPROVED)        
        ->paginate(8);
        return response()->json($purchase);
    }
}
