<?php

namespace App\Http\Controllers\Unit;
use App\Models\UserActivityLog;
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
        $this->logActivity(
            auth()->id(),
            'create',
            [
                'unit' => $unit->name,
                'changes' => "Created a new unit: " . $unit->name,
            ],
            $unit->id,
            Unit::class
        );
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
        $oldValues = $unit->getOriginal();

        $unit->name = $request->name;
        $unit->slug = $request->slug ?? Str::slug($request->name);
        $unit->short_code = $request->short_code;
        $unit->updated_by = auth()->id();
        $unit->save();
        $changes = UserActivityLog::logChanges($oldValues, $unit->getAttributes());

        $this->logActivity(
            auth()->id(),
            'update',
            [
                'unit' => $unit->name,
                'changes' => $changes,
            ],
            $unit->id,
            Unit::class
        );
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
        $this->logActivity(
            auth()->id(),
            'delete',
            [
                'unit' => $unit->name,
                'changes' => "Deleted unit: " . $unit->name,
            ],
            $unit->id,
            Unit::class
        );
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