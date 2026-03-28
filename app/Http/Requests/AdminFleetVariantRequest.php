<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminFleetVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('fleet_admin') || $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'is_default' => 'required|boolean',
            'pax_capacity' => 'required|numeric|min:0',
            'cargo_capacity' => 'required|numeric|min:0',
            'fuel_capacity' => 'required|numeric|min:1',
            'range' => 'required|numeric|min:1',
            'mtow' => 'required|numeric|min:1',
            'zfw' => 'required|numeric|min:1|lte:mtow',
        ];
    }
}
