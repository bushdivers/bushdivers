<?php

namespace App\Services\User;

class CreateApiToken
{
    public function execute($user)
    {
        $token = $user->createToken('bush-tracker');
        $user->api_token = $token->plainTextToken;
        $user->save();
    }
}
