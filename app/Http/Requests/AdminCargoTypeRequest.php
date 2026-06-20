<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminCargoTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('dispatcher') || $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'text' => ['required', 'string', 'max:255'],
            'type' => $this->isMethod('POST') ? ['required', 'integer', Rule::in([1, 2])] : ['sometimes'],
            'min_cargo_split' => ['required', 'integer', 'min:1'],
        ];
    }
}
