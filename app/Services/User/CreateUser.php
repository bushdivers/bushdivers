<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUser
{
    public function execute($name, $email, $password, $optin): User
    {
        $user = new User();
        $user->name = $name;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->current_airport_id = 'AYMR';
        $user->toc_accepted = true;
        $user->opt_in = $optin;
        $user->rank_id = 1;
$user->loan = 0.00;
        $user->save();

        return $user;
    }
}
