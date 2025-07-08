<?php

namespace App\Http\Controllers\Category;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $category = new Category();

        $category->name = $request->name;
        $category->slug = $request->slug ?? Str::slug($request->name);
        $category->short_code = $request->short_code;

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
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $category->name = $request->name;
        $category->slug = $request->slug ?? Str::slug($request->name);
        $category->short_code = $request->short_code;

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
}