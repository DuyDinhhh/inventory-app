<?php

namespace App\Http\Controllers\Product;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use Picqer\Barcode\BarcodeGeneratorHTML;
use App\Models\UserActivityLog;

class ProductController extends Controller
{
    public function index(Request $request){
        $products = Product::with(['category', 'unit','createdBy','updatedBy'])->orderBy('created_at','desc')->paginate(8);
        foreach ($products as $product) {
            if ($product->product_image) {
                $product->product_image = asset('images/product/' . $product->product_image);
            } else {
                $product->product_image = null;
            }
        } 
        return response()->json($products);
    }
    public function list(){
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
    
    public function store(StoreProductRequest $request)
    {
        $product = new Product();
        $product->name = $request->name;
        $product->slug = $request->slug ?? \Str::slug($request->name);
        $product->code = $request->code;
        $product->category_id = $request->category_id;
        $product->unit_id = $request->unit_id;
        $product->quantity_alert = $request->quantity_alert;
        $product->buying_price = $request->buying_price;
        $product->selling_price = $request->selling_price;
        $product->tax = $request->tax;
        $product->tax_type = (int) $request->tax_type;
        $product->notes = $request->notes;
        $product->created_by = auth()->id();
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            $exten = $file->extension();
            $imageName = ($product->slug ?? \Str::slug($request->name)) . "." . $exten;
            $file->move(public_path('images/product'), $imageName);
            $product->product_image = $imageName;
        }
        $product->save();
        $this->logActivity(
            auth()->id(),
            'create',
            [
                'product' => $product->name,
                'changes' => "Created a new product: " . $product->name,
            ],
            $product->id,
            Product::class
        );
        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Product created successfully.',
            'product' => $product,
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'unit','createdBy','updatedBy'])->find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        if ($product->product_image) {
            $product->product_image = asset('images/product/' . $product->product_image);
        } else {
            $product->product_image = null;
        }
        if ($product->code) {
            $generator = new BarcodeGeneratorHTML();
            $product->barcode_html = $generator->getBarcode($product->code, $generator::TYPE_CODE_128);
        } else {
            $product->barcode_html = null;
        }
        return response()->json($product);
    }

    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        $oldValues = $product->getOriginal();
        $product->name = $request->name;
        $product->slug = $request->slug ?? \Str::slug($request->name);
        $product->code = $request->code;
        $product->category_id = $request->category_id;
        $product->unit_id = $request->unit_id;
        $product->quantity_alert = $request->quantity_alert  ;
        $product->buying_price = $request->buying_price  ;
        $product->selling_price = $request->selling_price  ;
        $product->tax = $request->tax  ;
        $product->tax_type = (int) $request->tax_type;;  
        $product->notes = $request->notes  ;
        $product->updated_by = auth()->id();
         if ($request->hasFile('product_image')) {
             $oldImage = $product->product_image;
            if ($oldImage) {
                $oldPath = public_path('images/product/' . $oldImage);
                if (file_exists($oldPath)) {
                    @unlink($oldPath); // Delete the old image file from disk
                }
            }
        
            $file = $request->file('product_image');
            $exten = $file->extension();
            $imageName = $product->slug . "." . $exten;
            $file->move(public_path('images/product'), $imageName);
        
            $product->product_image = $imageName;
        }

        $product->save();
        $changes = UserActivityLog::logChanges($oldValues, $product->getAttributes());

        $this->logActivity(
            auth()->id(),
            'update',
            [
                'product' => $product->name,
                'changes' => $changes,
            ],
            $product->id,
            Product::class
        );
        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Product updated successfully.',
            'product' => $product,
        ]);
    }

    public function destroy($id)
    {
        try {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }
            $product->delete();
 

            $this->logActivity(
                auth()->id(),
                'delete',
                [
                    'product' => $product->name,
                    'changes' => "Deleted product: " . $product->name,
                ],
                $product->id,
                Product::class
            );
            return response()->json(['message' => 'Product deleted successfully']);
        }
        catch (Exception $e) {
       
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function search(Request $request)
    {
        $search = $request->query('q'); // Use 'q' as the query parameter
        \Log::debug($search);
        $products = Product::with(['category', 'unit'])
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->paginate(10);

        foreach ($products as $product) {
            if ($product->product_image) {
                $product->product_image = asset('images/product/' . $product->product_image);
            } else {
                $product->product_image = null;
            }
        }
        return response()->json($products);
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