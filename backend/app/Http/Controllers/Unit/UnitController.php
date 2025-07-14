<?php

namespace App\Http\Controllers\Unit;

use App\Models\Unit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\Unit\StoreUnitRequest;
use App\Http\Requests\Unit\UpdateUnitRequest;
class UnitController extends Controller
{
    public function index(Request $request)
    {
        $units = Unit::with('createdBy','updatedBy')->orderBy('created_at','desc')->paginate(8);
        return response()->json($units);
    }

    public function store(StoreUnitRequest $request)
    {
        $unit = new Unit();

        $unit->name = $request->name;
        $unit->slug = $request->slug ?? Str::slug($request->name);
        $unit->short_code = $request->short_code;
        $unit->created_by = auth()->id();

        $unit->save();

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Unit created successfully.',
            'unit' => $unit,
        ]);
    }

    public function show($id)
    {
        $unit = Unit::with('createdBy','updatedBy')->find($id);
        if (!$unit) {
            return response()->json(['error' => 'Unit not found'], 404);
        }
        return response()->json($unit);
    }

    public function update(UpdateUnitRequest $request, $id)
    {
        $unit = Unit::findOrFail($id);

        $unit->name = $request->name;
        $unit->slug = $request->slug ?? Str::slug($request->name);
        $unit->short_code = $request->short_code;
        $unit->updated_by = auth()->id();
        $unit->save();

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Unit updated successfully.',
            'unit' => $unit,
        ]);
    }

    public function destroy($id)
    {
        $unit = Unit::find($id);
        if (!$unit) {
            return response()->json(['error' => 'Unit not found'], 404);
        }
        $unit->delete();
        return response()->json(['message' => 'Unit deleted successfully']);
    }

    public function search(Request $request)
    {
        $search = $request->query('q');  
        $units = Unit::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate(8);
        return response()->json($units);
    }
    
}