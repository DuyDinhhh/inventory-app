<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'email' => 'nullable|email|max:50',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:100',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',  
            'account_holder' => 'nullable|string|max:50',
            'account_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string|max:50',
        ];
    }
}
