<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
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
        'user_roles',
        'balance'
    ];

    public function getPrivateNameAttribute()
    {
        $split = explode(' ', $this->name);

        if (count($split) >= 2) {
            return $split[0] . ' ' . mb_substr($split[1], 0, 1);
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
        $customBookings = Contract::where('user_id', $this->id)->where('is_completed', false)->count();
        $bdBookings = Contract::where('is_available', false)
            ->where('is_completed', false)
            ->where('user_id', null)
            ->count();
        return $customBookings + $bdBookings;
    }

    public function getRank()
    {
        return Rank::find($this->rank_id);

    }

    public function getUserRolesAttribute()
    {
        $r = [];
        foreach ($this->roles as $role) {
            $r[] = $role->role;
        }

        return $r;
    }

    public function getBalanceAttribute()
    {
        return DB::table('user_accounts')
            ->where('user_id', $this->id)
            ->sum('total');
    }

    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }

    public function awards()
    {
        return $this->belongsToMany(Award::class, 'award_user')->orderBy('awards.type')->orderBy('awards.value');
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
