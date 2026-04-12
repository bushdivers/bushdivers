<?php

namespace App\Http\Requests;

use App\Models\Enums\SimType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CreateLiveryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('fleet_admin') || $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'display_name' => 'nullable|required_without:uploaded_file|string|max:255',
            'author' => 'nullable|string|max:255',
            'sim_type' => 'nullable|array',
            'sim_type.*' => [new Enum(SimType::class)],
            'uploaded_file' => 'required_without:url|nullable|file|mimes:zip,png,jpg,jpeg',
            'url' => 'required_without:uploaded_file|nullable|url|max:500',
        ];
    }
}
