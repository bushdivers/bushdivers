<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManualPirepRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'pirep_id' => 'required',
            'fuel_used' => 'required|numeric',
            'distance' => 'required|numeric',
            'flight_time_mins' => 'required|numeric'
        ];
    }
}
