<?php

namespace App\Http\Requests;

use App\Models\Airport;
use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateAirportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->hasRole('airport_manager') || $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            //'country' => ['nullable', 'string', 'max:255'],
            //'country_code' => ['nullable', 'string', 'max:2', 'exists:airports,country_code'],
            'magnetic_variance' => ['nullable', 'numeric', 'between:-180,180'],
            'altitude' => ['nullable', 'integer', 'min:-1000', 'max:30000'],
            'size' => ['nullable', 'integer', 'min:1', 'max:5'],
            'longest_runway_length' => ['nullable', 'integer', 'min:0', 'max:20000'],
            'longest_runway_width' => ['nullable', 'integer', 'min:0', 'max:500'],
            'longest_runway_surface' => ['nullable', 'string', 'max:255'],
            'has_avgas' => ['boolean'],
            'has_jetfuel' => ['boolean'],
        ];
    }

    /**
     * Get the validated data from the request with default values.
     *
     * @return array
     */
    public function validatedWithDefaults()
    {
        $validated = $this->validated();

        $validated['magnetic_variance'] = $validated['magnetic_variance'] ?? 0;
        //$validated['identifier'] = strtoupper($validated['identifier']);
        //$validated['flag'] = Airport::where('country_code', $validated['country_code'] ?? '')->first()?->flag ?? null;

        return $validated;
    }
}
