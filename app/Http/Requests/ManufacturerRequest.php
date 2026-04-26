<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ManufacturerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('fleet_admin') || $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('manufacturers', 'name')->ignore($this->route('manufacturer')),
            ],
            'uploaded_file' => 'nullable|file|mimes:png,jpg,jpeg',
        ];
    }
}
