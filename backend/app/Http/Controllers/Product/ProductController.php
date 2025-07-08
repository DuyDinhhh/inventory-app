<?php

namespace App\Http\Controllers\Product;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
class ProductController extends Controller
{
    public function index(Request $request){
        $products = Product::with(['category', 'unit'])->get();
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
        $product->quantity = $request->quantity;
        $product->quantity_alert = $request->quantity_alert;
        $product->buying_price = $request->buying_price;
        $product->selling_price = $request->selling_price;
        $product->tax = $request->tax;
        $product->tax_type = (int) $request->tax_type;
        $product->notes = $request->notes;

        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            $exten = $file->extension();
            $imageName = ($product->slug ?? \Str::slug($request->name)) . "." . $exten;
            $file->move(public_path('images/product'), $imageName);
            $product->product_image = $imageName;
        }

        $product->save();
        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Product created successfully.',
            'product' => $product,
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'unit'])->find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        if ($product->product_image) {
            $product->product_image = asset('images/product/' . $product->product_image);
        } else {
            $product->product_image = null;
        }
        return response()->json($product);
    }

    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
    
        $product->name = $request->name;
        $product->slug = $request->slug ?? \Str::slug($request->name);
        $product->code = $request->code;
        $product->category_id = $request->category_id;
        $product->unit_id = $request->unit_id;
        $product->quantity = $request->quantity  ;
        $product->quantity_alert = $request->quantity_alert  ;
        $product->buying_price = $request->buying_price  ;
        $product->selling_price = $request->selling_price  ;
        $product->tax = $request->tax  ;
        $product->tax_type = (int) $request->tax_type;;  
        $product->notes = $request->notes  ;

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
        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Product updated successfully.',
            'product' => $product,
        ]);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}