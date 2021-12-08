<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        'private_name',
        'pilot_id',
        'user_roles'
    ];

    public function getPrivateNameAttribute()
    {
        $words = explode(' ', $this->name);
        if (count($words) >= 2) {
            return $words[0] . ' ' .  end($words)[0];
        } else {
            return $this->name;
        }
    }

    public function getPilotIdAttribute()
    {
        $number = str_pad($this->id, 4, "0", STR_PAD_LEFT);
        return 'BDV'.$number;
    }

    public function getCurrentBidsAttribute()
    {
        $bookings = Contract::where('user_id', $this->id)->where('is_completed', false)->get();
        return $bookings->count();
    }

    public function getUserRolesAttribute()
    {
        $r = [];
        foreach ($this->roles as $role) {
            $r[] = $role->role;
        }

        return $r;
    }

    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }

    public function awards()
    {
        return $this->belongsToMany(Award::class, 'award_user');
    }

    public function location()
    {
        return $this->belongsTo(Airport::class, 'current_airport_id', 'identifier');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}
