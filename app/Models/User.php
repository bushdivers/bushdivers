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
        'pilot_id'
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

    public function getCurrentBookingsAttribute()
    {
        $bookings = Booking::where('user_id', $this->id)->get();
        return $bookings->count();
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function rank()
    {
        return $this->hasOne(Rank::class);
    }

    public function awards()
    {
        return $this->belongsToMany(Award::class);
    }
}
