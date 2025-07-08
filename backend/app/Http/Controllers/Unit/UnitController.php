<?php

namespace App\Http\Controllers\Unit;

use App\Models\Unit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $units = Unit::all();
        return response()->json($units);
    }

    public function store(Request $request)
    {
        $unit = new Unit();

        $unit->name = $request->name;
        $unit->slug = $request->slug ?? Str::slug($request->name);
        $unit->short_code = $request->short_code;

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
        $unit = Unit::find($id);
        if (!$unit) {
            return response()->json(['error' => 'Unit not found'], 404);
        }
        return response()->json($unit);
    }

    public function update(Request $request, $id)
    {
        $unit = Unit::findOrFail($id);

        $unit->name = $request->name;
        $unit->slug = $request->slug ?? Str::slug($request->name);
        $unit->short_code = $request->short_code;

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
}