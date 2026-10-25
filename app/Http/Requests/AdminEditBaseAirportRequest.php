<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminEditBaseAirportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'icao' => ['required', 'string', Rule::exists('airports', 'identifier')
                ->where('is_thirdparty', false)
                ->where('is_hub', false)],
            'reassign_to' => ['nullable', 'integer', 'required_if:closed,true', Rule::exists('airports', 'id')
                ->where('is_thirdparty', false)
                ->where('closed', false)
                ->whereNull('user_id')],
            'closed' => ['required', 'boolean']
        ];
    }
}
