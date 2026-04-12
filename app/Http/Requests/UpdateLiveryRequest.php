<?php

namespace App\Http\Requests;

use App\Models\Enums\SimType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateLiveryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('fleet_admin') || $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'display_name' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'sim_type' => 'nullable|array',
            'sim_type.*' => [new Enum(SimType::class)],
        ];
    }
}
