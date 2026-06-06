<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',

        'current_airport_id',

        'allow_thirdparty_airport',
        'allow_thirdparty_hub',
        'allow_campsite_airport',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'reset_token',
        'api_token',
        'email',
        'name',
        'user_roles',
        'roles',
        'balance',
        'loan',
        'opt_in',
        'is_admin',

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

    public function getRank(): ?Rank
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

    public function hasRole(string $role): bool
    {
        return $this->is_admin || in_array($role, $this->user_roles);
    }

    protected function balance(): Attribute
    {
        return Attribute::make(
            get: fn () => DB::table('user_accounts')
                ->where('user_id', $this->id)
                ->sum('total'),
        );
    }

    /**
     * @return BelongsTo<Rank, User>
     */
    public function rank(): BelongsTo
    {
        return $this->belongsTo(Rank::class);
    }

    /**
     * @return BelongsToMany<Award, $this>
     */
    public function awards(): BelongsToMany
    {
        return $this->belongsToMany(Award::class, 'award_user')->orderBy('awards.type')->orderBy('awards.value');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'current_airport_id');
    }

    /**
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * @return HasOne<Pirep, $this>
     */
    public function latestPirep(): HasOne
    {
        return $this->hasOne(Pirep::class)->latestOfMany('submitted_at');
    }

    /**
     * @return HasMany<Pirep, $this>
     */
    public function pireps(): HasMany
    {
        return $this->hasMany(Pirep::class)->orderBy('submitted_at', 'desc');
    }
}
