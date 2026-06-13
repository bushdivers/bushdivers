<?php

namespace App\Services\User;

use App\Models\User;

class CreateApiToken
{
    public function execute(User $user): void
    {
        $token = $user->createToken('bush-tracker');
        $user->api_token = $token->plainTextToken;
        $user->save();
    }
}
