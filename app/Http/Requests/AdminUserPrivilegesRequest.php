<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserPrivilegesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'is_admin' => 'required|boolean',
            'roles'    => 'nullable|array',
            'roles.*'  => 'exists:roles,id',
        ];
    }
}
