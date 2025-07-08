<?php

namespace App\Http\Controllers\User;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserController extends Controller
{
    // List all users
    public function index(Request $request)
    {
        $users = User::orderBy('created_at','desc')->get();
        foreach ($users as $user) {
            if ($user->photo) {
                $user->photo = asset('images/user/' . $user->photo);
            } else {
                $user->photo = null;
            }
        }
        return response()->json($users);
    }

    // Store new user
    public function store(Request $request)
    {
        $user = new User();

        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->email_verified_at = $request->email_verified_at ?? null;

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $exten = $file->extension();
            $imageName = (Str::slug($request->username) ?: 'user') . "." . $exten;
            $file->move(public_path('images/user'), $imageName);
            $user->photo = $imageName;
        }

        $user->save();

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
        $user = User::find($id);
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
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
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

        $user->save();

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
        return response()->json(['message' => 'User deleted successfully']);
    }
}