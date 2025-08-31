<?php

namespace App\Http\Requests;

use App\Models\Airport;
use Illuminate\Foundation\Http\FormRequest;
use Location\Coordinate;

class AdminCreateAirportRequest extends FormRequest
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
        $lon = $this->input('lon');
        return [
            'identifier' => [
                'required',
                'string',
                'max:5',
                'alpha_num',
                function ($attribute, $value, $fail) {
                    // Check if identifier exists in any airports (including third-party)
                    if (Airport::where('identifier', $value)->exists()) {
                        $fail('The airport identifier already exists.');
                    }
                },
            ],
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'country_code' => ['nullable', 'string', 'max:2', 'exists:airports,country_code'],
            'lat' => [
                'required',
                'numeric',
                'between:-90,90',
                function ($attribute, $value, $fail) use ($lon) {
                    $coord = new Coordinate($value, $lon);
                    if (Airport::whereNull('user_id')->inRangeOf($coord, 0, 2)->exists()) {
                        $fail('An airport already exists within 2nm of these coordinates.');
                    }
                }
            ],
            'lon' => ['required', 'numeric', 'between:-180,180'],
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
    /**
     * Get the validated data from the request with default values.
     *
     * @return array
     */
    public function validatedWithDefaults()
    {
        $validated = $this->validated();

        $validated['is_thirdparty'] = true;
        $validated['magnetic_variance'] = $validated['magnetic_variance'] ?? 0;
        $validated['identifier'] = strtoupper($validated['identifier']);
        $validated['flag'] = Airport::where('country_code', $validated['country_code'] ?? '')->first()?->flag ?? null;

        return $validated;
    }
}
