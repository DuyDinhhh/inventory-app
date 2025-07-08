<?php

namespace App\Http\Controllers\Customer;

use App\Models\Customer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::orderBy('created_at','desc')->get();
        foreach ($customers as $customer) {
            if ($customer->photo) {
                $customer->photo = asset('images/customer/' . $customer->photo);
            } else {
                $customer->photo = null;
            }
        }
        return response()->json($customers);
    }

    public function store(Request $request)
    {
        $customer = new Customer();

        $customer->name = $request->name;
        $customer->email = $request->email;
        $customer->phone = $request->phone;
        $customer->address = $request->address;
        $customer->account_holder = $request->account_holder;
        $customer->account_number = $request->account_number;
        $customer->bank_name = $request->bank_name;

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $exten = $file->extension();
            $imageName = (Str::slug($request->name) ?: 'customer') . "." . $exten;
            $file->move(public_path('images/customer'), $imageName);
            $customer->photo = $imageName;
        }

        $customer->save();

        $customer->photo = $customer->photo ? asset('images/customer/' . $customer->photo) : null;

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Customer created successfully.',
            'customer' => $customer,
        ]);
    }

    public function show($id)
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }
        if ($customer->photo) {
            $customer->photo = asset('images/customer/' . $customer->photo);
        } else {
            $customer->photo = null;
        }
        return response()->json($customer);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $customer->name = $request->name;
        $customer->email = $request->email;
        $customer->phone = $request->phone;
        $customer->address = $request->address;
        $customer->account_holder = $request->account_holder;
        $customer->account_number = $request->account_number;
        $customer->bank_name = $request->bank_name;

        if ($request->hasFile('photo')) {
            $oldPhoto = $customer->photo;
            if ($oldPhoto) {
                $oldPath = public_path('images/customer/' . basename($oldPhoto));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $file = $request->file('photo');
            $exten = $file->extension();
            $imageName = (Str::slug($request->name) ?: 'customer') . "." . $exten;
            $file->move(public_path('images/customer'), $imageName);
            $customer->photo = $imageName;
        }

        $customer->save();

        $customer->photo = $customer->photo ? asset('images/customer/' . $customer->photo) : null;

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'message' => 'Customer updated successfully.',
            'customer' => $customer,
        ]);
    }

    public function destroy($id)
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }
        if ($customer->photo) {
            $photoPath = public_path('images/customer/' . basename($customer->photo));
            if (file_exists($photoPath)) {
                @unlink($photoPath);
            }
        }
        $customer->delete();
        return response()->json(['message' => 'Customer deleted successfully']);
    }
}