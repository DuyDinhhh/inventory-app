<?php

namespace App\Http\Controllers\User;
use App\Models\UserActivityLog;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use Illuminate\Validation\ValidationException;


class UserController extends Controller
{
    // List all users
    public function index(Request $request)
    {
        $users = User::with('createdBy','updatedBy')->orderBy('created_at','desc')->paginate(8);
        foreach ($users as $user) {
            if ($user->photo) {
                $user->photo = asset('images/user/' . $user->photo);
            } else {
                $user->photo = null;
            }
        }

        \Log::debug(auth()->user()->role->role_name);
        return response()->json($users);
    }

    // Store new user
    public function store(StoreUserRequest $request)
    {
        $user = new User();

        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->email_verified_at = $request->email_verified_at ?? null;
        $user->created_by = auth()->id();

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $exten = $file->extension();
            $imageName = (Str::slug($request->username) ?: 'user') . "." . $exten;
            $file->move(public_path('images/user'), $imageName);
            $user->photo = $imageName;
        }
        $user->save();
        $this->logActivity(
            auth()->id(),
            'create',
            [
                'user' => $user->name,
                'changes' => "Created a new user: " . $user->name,
            ],
            $user->id,
            User::class
        );
        $user->photo = $user->photo ? asset('images/user/' . $user->photo) : null;
        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'User created successfully.',
            'user' => $user,
        ]);
    }

    // Show single user
    public function show($id)
    {
        $user = User::with('createdBy','updatedBy')->find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        if ($user->photo) {
            $user->photo = asset('images/user/' . $user->photo);
        } else {
            $user->photo = null;
        }
        return response()->json($user);
    }

    // Update user
    public function update(UpdateUserRequest $request, $id)
    {            

        $user = User::findOrFail($id);
        $oldValues = $user->getOriginal();

        if (
            $request->filled('current_password') &&
            ($request->filled('password') || $request->email !== $user->email || $request->username !== $user->username)
        ) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.'],
                ]);
            }
        }
        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->email_verified_at = $request->email_verified_at ?? $user->email_verified_at;
        if ($request->hasFile('photo')) {
            $oldPhoto = $user->photo;
            if ($oldPhoto) {
                $oldPath = public_path('images/user/' . basename($oldPhoto));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $file = $request->file('photo');
            $exten = $file->extension();
            $imageName = (Str::slug($request->username) ?: 'user') . "." . $exten;
            $file->move(public_path('images/user'), $imageName);
            $user->photo = $imageName;
        }
        $user->updated_by = auth()->id();
        $user->save();

        $changes = UserActivityLog::logChanges($oldValues, $user->getAttributes());
        $this->logActivity(
            auth()->id(),
            'update',
            [
                'user' => $user->name,
                'changes' => $changes,
            ],
            $user->id,
            User::class
        );
        $user->photo = $user->photo ? asset('images/user/' . $user->photo) : null;

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }


    // Delete user
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        if ($user->photo) {
            $photoPath = public_path('images/user/' . basename($user->photo));
            if (file_exists($photoPath)) {
                @unlink($photoPath);
            }
        }
        $user->delete();
        $this->logActivity(
            auth()->id(),
            'delete',
            [
                'user' => $user->name,
                'changes' => "Deleted user: " . $user->name,
            ],
            $user->id,
            User::class
        );
        return response()->json(['message' => 'User deleted successfully']);
    }
    public function search(Request $request)
    {
        $search = $request->query('q');  
        $users = User::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate(8);
    
        foreach ($users as $user) {
            $user->photo = $user->photo 
                ? asset('images/user/' . $user->photo) 
                : null;
        }
    
        return response()->json($users);
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