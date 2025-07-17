<?php

namespace App\Http\Controllers\Category;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\UserActivityLog;
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

        $this->logActivity(
            auth()->id(),
            'create',
            [
                'category' => $category->name,
                'changes' => "Created a new category: " . $category->name,
            ],
            $category->id,
            Category::class
        );
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

        // Store the old values before updating
        $oldValues = $category->getOriginal();

        // Update the category with the new values
        $category->name = $request->name;
        $category->slug = $request->slug ?? Str::slug($request->name);
        $category->short_code = $request->short_code;
        $category->updated_by = auth()->id();
        $category->save();

        $changes = UserActivityLog::logChanges($oldValues, $category->getAttributes());

        $this->logActivity(
            auth()->id(),
            'update',
            [
                'category' => $category->name,
                'changes' => $changes,
            ],
            $category->id,
            Category::class
        );
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
        $this->logActivity(
            auth()->id(),
            'delete',
            [
                'category' => $category->name,
                'changes' => "Deleted category: " . $category->name,
            ],
            $category->id,
            Category::class
        );
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