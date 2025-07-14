<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
             'code' => 'required|string|max:20',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'quantity_alert' => 'required|integer|min:0',
            'buying_price' => 'required|integer|min:0',
            'selling_price' => 'required|integer|min:0',
            'tax' => 'nullable|numeric|between:0,99999999.99',
            'tax_type' => 'nullable|max:20',
            'notes' => 'nullable|string',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];
    }
}
