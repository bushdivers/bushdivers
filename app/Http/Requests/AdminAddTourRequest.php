<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminAddTourRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole('tour_admin') || $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|unique:tours',
            'description' => 'required',
            'start' => 'required'
        ];
    }
}
