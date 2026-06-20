<?php

namespace App\Http\Requests;

use App\Models\Airport;
use App\Models\Enums\CargoType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminMissionJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasRole('tour_admin') || $this->user()?->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'departure' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!Airport::where('identifier', $value)->base()->exists()) {
                        $fail('The departure airport is invalid or not available for missions.');
                    }
                },
            ],
            'destination' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!Airport::where('identifier', $value)->base()->exists()) {
                        $fail('The arrival airport is invalid or not available for missions.');
                    }
                },
            ],
            'cargo_type' => ['required', Rule::enum(CargoType::class)],
            'cargo' => ['required', 'string', 'max:255'],
            'qty' => ['required', 'integer', 'min:1'],
            'recurring' => ['required', 'boolean'],
            'inject_immediately' => ['sometimes', 'boolean'],
        ];
    }
}
