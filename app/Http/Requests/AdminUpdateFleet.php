<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateFleet extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->is_admin;
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
            'powerplants' => 'required',
            'engines' => 'required|numeric',
            'fuel' => 'required|numeric',
            'zfw' => 'required|numeric',
            'mtow' => 'required|numeric',
            'cargo' => 'required|numeric',
            'pax' => 'required|numeric',
            'fuelCapacity' => 'required|numeric',
            'ceiling' => 'required|numeric',
            'range' => 'required|numeric',
            'cruise' => 'required|numeric',
            'size' => 'required'
        ];
    }
}
