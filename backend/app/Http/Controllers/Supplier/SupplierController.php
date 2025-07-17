<?php

namespace App\Http\Controllers\Supplier;
use App\Models\UserActivityLog;
use App\Models\Supplier;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = Supplier::with('createdBy','updatedBy')->orderBy('created_at', 'desc')->paginate(8);
        foreach ($suppliers as $supplier) {
            if ($supplier->photo) {
                $supplier->photo = asset('images/supplier/' . $supplier->photo);
            } else {
                $supplier->photo = null;
            }
        }
        return response()->json($suppliers);
    }

    public function store(StoreSupplierRequest $request)
    {
        $supplier = new Supplier();
        $supplier->name = $request->name;
        $supplier->email = $request->email;
        $supplier->phone = $request->phone;
        $supplier->address = $request->address;
        $supplier->shopname = $request->shopname;
        $supplier->type = $request->type;
        $supplier->account_holder = $request->account_holder;
        $supplier->account_number = $request->account_number;
        $supplier->bank_name = $request->bank_name;
        $supplier->created_by = auth()->id();

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $exten = $file->extension();
            $imageName = (Str::slug($request->name) ?: 'supplier') . "." . $exten;
            $file->move(public_path('images/supplier'), $imageName);
            $supplier->photo = $imageName;
        }
        $supplier->save();
        $this->logActivity(
            auth()->id(),
            'create',
            [
                'supplier' => $supplier->name,
                'changes' => "Created a new supplier: " . $supplier->name,
            ],
            $supplier->id,
            Supplier::class
        );
        $supplier->photo = $supplier->photo ? asset('images/supplier/' . $supplier->photo) : null;

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Supplier created successfully.',
            'supplier' => $supplier,
        ]);
    }

    public function show($id)
    {
        $supplier = Supplier::with('createdBy','updatedBy')->find($id);
        if (!$supplier) {
            return response()->json(['error' => 'Supplier not found'], 404);
        }
        if ($supplier->photo) {
            $supplier->photo = asset('images/supplier/' . $supplier->photo);
        } else {
            $supplier->photo = null;
        }
        return response()->json($supplier);
    }

    public function update(UpdateSupplierRequest $request, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $oldValues = $supplier->getOriginal();

        $supplier->name = $request->name;
        $supplier->email = $request->email;
        $supplier->phone = $request->phone;
        $supplier->address = $request->address;
        $supplier->shopname = $request->shopname;
        $supplier->type = $request->type;
        $supplier->account_holder = $request->account_holder;
        $supplier->account_number = $request->account_number;
        $supplier->bank_name = $request->bank_name;
        $supplier->updated_by = auth()->id();
        if ($request->hasFile('photo')) {
            $oldPhoto = $supplier->photo;
            if ($oldPhoto) {
                $oldPath = public_path('images/supplier/' . basename($oldPhoto));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('photo');
            $exten = $file->extension();
            $imageName = (Str::slug($request->name) ?: 'supplier') . "." . $exten;
            $file->move(public_path('images/supplier'), $imageName);
            $supplier->photo = $imageName;
        }

        $supplier->save();
        $changes = UserActivityLog::logChanges($oldValues, $supplier->getAttributes());

        $this->logActivity(
            auth()->id(),
            'update',
            [
                'supplier' => $supplier->name,
                'changes' => $changes,
            ],
            $supplier->id,
            Supplier::class
        );
        $supplier->photo = $supplier->photo ? asset('images/supplier/' . $supplier->photo) : null;

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Supplier updated successfully.',
            'supplier' => $supplier,
        ]);
    }

    public function destroy($id)
    {
        $supplier = Supplier::find($id);
        if (!$supplier) {
            return response()->json(['error' => 'Supplier not found'], 404);
        }

        if ($supplier->photo) {
            $photoPath = public_path('images/supplier/' . basename($supplier->photo));
            if (file_exists($photoPath)) {
                @unlink($photoPath);
            }
        }

        $supplier->delete();
        $this->logActivity(
            auth()->id(),
            'delete',
            [
                'supplier' => $supplier->name,
                'changes' => "Deleted supplier: " . $supplier->name,
            ],
            $supplier->id,
            Supplier::class
        );
        return response()->json(['message' => 'Supplier deleted successfully']);
    }

    public function search(Request $request)
    {
        $search = $request->query('q');  
        $suppliers = Supplier::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('shopname', 'like', "%{$search}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate(8);
    
        foreach ($suppliers as $supplier) {
            $supplier->photo = $supplier->photo 
                ? asset('images/supplier/' . $supplier->photo) 
                : null;
        }
    
        return response()->json($suppliers);
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