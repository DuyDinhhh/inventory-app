<?php

namespace App\Http\Controllers\Category;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::with('createdBy','updatedBy')->orderby('created_at','desc')->paginate(8);
        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = new Category();

        $category->name = $request->name;
        $category->slug = $request->slug ?? Str::slug($request->name);
        $category->short_code = $request->short_code;
        $category->created_by = auth()->id();

        $category->save();

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Category created successfully.',
            'category' => $category,
        ]);
    }

    public function show($id)
    {
        $category = Category::with('createdBy','updatedBy')->find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        return response()->json($category);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);

        $category->name = $request->name;
        $category->slug = $request->slug ?? Str::slug($request->name);
        $category->short_code = $request->short_code;
        $category->updated_by = auth()->id();
        $category->save();

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Category updated successfully.',
            'category' => $category,
        ]);
    }

    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function search(Request $request)
    {
        $search = $request->query('q');  
        $categories = Category::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate(8);
     
        return response()->json($categories);
    }
}