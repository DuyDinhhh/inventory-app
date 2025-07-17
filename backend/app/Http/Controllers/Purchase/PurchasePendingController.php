<?php

namespace App\Http\Controllers\Purchase;
use App\Models\Purchase;
use App\Enums\PurchaseStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserActivityLog;
class PurchasePendingController extends Controller
{
    public function pendingPurchases(){
        $purchase = Purchase::with(['supplier', 'purchaseDetails','createdBy','updatedBy'])
        ->orderBy("created_at","desc")
        ->where('status', PurchaseStatus::PENDING)        
        ->paginate(8);
        return response()->json($purchase);
    }
}
