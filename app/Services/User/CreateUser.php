<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\Airport;
use Illuminate\Support\Facades\Hash;

class CreateUser
{
    public function execute($name, $email, $password): User
    {
        $user = new User();
        $user->name = $name;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->current_airport_id = Airport::whereIdentifier('AYMR')->first()->id;
        $user->toc_accepted = true;
        $user->opt_in = false;
        $user->rank_id = 1;
        $user->loan = 0.00;
        $user->email_verified_at = $user->freshTimestamp();
        $user->save();

        return $user;
    }
}
