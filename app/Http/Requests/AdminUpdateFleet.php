<?php

namespace App\Http\Requests;

use App\Models\Enums\AircraftType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateFleet extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->hasRole('fleet_admin') || $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'type' => 'required',
            'name' => 'required',
            'manufacturer' => 'required',
            'aircraft_type' => ['required', Rule::enum(AircraftType::class)],
            'has_floats' => 'required|boolean',
            'powerplants' => 'required',
            'engines' => 'required|numeric',
            'tbo_mins' => 'required|numeric|min:1',
            'fuel' => 'required|numeric',
            'ceiling' => 'required|numeric',
            'cruise' => 'required|numeric',
            'size' => 'required',

            'company_fleet' => 'required|boolean',
            'is_rental' => 'required|boolean',
            'rental_cost' => 'required_if:is_rental,true|numeric',
            'hq' => 'required|exists:airports,identifier',
            'can_purchase_new' => 'boolean',
            'new_price' => 'nullable|required_if:can_purchase_new,true|numeric|gte:used_high_price|gt:0',
            'used_low_price' => 'nullable|required_with:used_high_price|numeric',
            'used_high_price' => 'nullable|required_with:used_low_price|numeric|gte:used_low_price'
        ];
    }
}
