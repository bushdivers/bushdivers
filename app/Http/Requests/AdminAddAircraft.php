<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminAddAircraft extends FormRequest
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
            'fleet' => 'required|exists:fleets,id',
            'registration' => 'required|unique:aircraft',
            'hub' => 'required',
            'deliveryIcao' => 'required|exists:airports,identifier',
        ];
    }
}
